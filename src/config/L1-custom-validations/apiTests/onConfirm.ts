import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export async function onConfirm(payload: any): Promise<validationOutput> {
  const context = payload?.context;
  const domain = context?.domain;
  const action = context?.action;
  console.log(`Running validations for ${domain}/${action}`);

  const results: validationOutput = [];

  const validQuote = await validateQuote(payload);
  const validItems = await validateItems(payload);
  const validFulfillments = await validateFulfillments(payload);

  // Validate quote
  if (!validQuote) {
    results.push({
      valid: false,
      code: 63002,
      description: `LBNP is unable to validate the order request: Quote price does not match with /confirm`,
    });
  }

  // Validate items
  if (!validItems) {
    results.push({
      valid: false,
      code: 63003,
      description: `LBNP is unable to validate the order request: Items array does not match with /confirm`,
    });
  }

  // Validate fulfillments
  if (!validFulfillments) {
    results.push({
      valid: false,
      code: 63004,
      description: `LBNP is unable to validate the order request: Fulfillments array does not match with /confirm`,
    });
  }

  // If no issues found, return a success result
  if (results.length === 0) {
    results.push({ valid: true, code: 200 });
  }

  return results;
}

/**
 * Validates that the quote object is valid
 */
async function validateQuote(payload: Record<string, any>): Promise<boolean> {
  console.log("Running validateConfirmQuote");

  const transaction_id = payload?.context?.transaction_id;
  const quotePrice = payload?.message?.order?.quote?.price?.value;
  const quoteBreakup = payload?.message?.order?.quote?.breakup;

  console.log("Transaction ID:", transaction_id);
  console.log("Incoming Quote Price:", quotePrice);

  if (!transaction_id) return false;
  if (quotePrice == null) return false;

  // Extract surge fee if present
  let surgeFee = 0;
  quoteBreakup?.forEach((breakup: any) => {
    console.log("Breakup Type:", breakup["@ondc/org/title_type"]);
    if (breakup["@ondc/org/title_type"] === "surge") {
      surgeFee += parseFloat(breakup.price?.value || "0");
    }
  });

  console.log("Surge Fee Amount:", surgeFee);

  const confirmQuoteRaw = await RedisService.getKey(
    `${transaction_id}:confirmQuote`
  );
  console.log("Redis Quote Raw:", confirmQuoteRaw);
  if (!confirmQuoteRaw) return true; // Allow if Redis data not found

  try {
    const confirmQuote = JSON.parse(confirmQuoteRaw);
    const storedPrice = confirmQuote?.quote?.price?.value;
    console.log("Stored Quote Price from Redis:", storedPrice);

    if (storedPrice == null) return false;

    // If surge fee is present, adjust the current quotePrice
    const adjustedQuotePrice = parseFloat(quotePrice) - surgeFee;
    console.log("Adjusted Incoming Quote Price:", adjustedQuotePrice);

    const isEqual = adjustedQuotePrice === parseFloat(storedPrice);
    console.log(
      `Price comparison: ${adjustedQuotePrice} === ${parseFloat(storedPrice)} =>`,
      isEqual
    );
    return isEqual;
  } catch (error) {
    console.error("Error parsing confirmQuote from Redis:", error);
    return false;
  }
}

/**
 * Validates that the items object is valid
 */
async function validateItems(payload: Record<string, any>): Promise<boolean> {
  const items = payload?.message?.order?.items;
  const transaction_id = payload?.context?.transaction_id;

  if (!Array.isArray(items) || !transaction_id) return false;

  const confirmItemsRaw = await RedisService.getKey(
    `${transaction_id}:confirmItems`
  );
  if (!confirmItemsRaw) return false;

  try {
    const parsed = JSON.parse(confirmItemsRaw);
    const confirmItems = parsed?.items;
    if (!Array.isArray(confirmItems)) return false;

    return items.every((item) => {
      const isSurgeItem = item.tags?.some(
        (tag: { code: string; list: any[] }) =>
          tag.code === "type" &&
          tag.list?.some((listItem) => listItem.value === "surge")
      );

      // If surge item, skip checking
      if (isSurgeItem) {
        console.log(`Skipping validation for surge item: ${item.id}`);
        return true;
      }

      // Otherwise, validate normally
      return confirmItems.some(
        (confirmItem) =>
          item.id === confirmItem.id &&
          JSON.stringify(item.fulfillment_id || []) ===
            JSON.stringify(confirmItem.fulfillment_id || []) &&
          JSON.stringify(item.fulfillment_ids || []) ===
            JSON.stringify(confirmItem.fulfillment_ids || []) &&
          item.category_id === confirmItem.category_id
      );
    });
  } catch (error) {
    console.error("Error parsing confirmItems from Redis:", error);
    return false;
  }
}

/**
 * Validates that the fulfillments object is valid
 */
async function validateFulfillments(
  payload: Record<string, any>
): Promise<boolean> {
  const fulfillments = payload?.message?.order?.fulfillments;
  const transaction_id = payload?.context?.transaction_id;

  if (!Array.isArray(fulfillments) || !transaction_id) return false;

  const confirmFulfillmentsRaw = await RedisService.getKey(
    `${transaction_id}:confirmFulfillments`
  );
  if (!confirmFulfillmentsRaw) return false;

  try {
    const parsed = JSON.parse(confirmFulfillmentsRaw);
    const confirmFulfillments = parsed?.fulfillments;
    if (!Array.isArray(confirmFulfillments)) return false;

    return fulfillments.every((fulfillment) =>
      confirmFulfillments.some(
        (confirmFulfillment) =>
          fulfillment.id === confirmFulfillment.id &&
          fulfillment.type === confirmFulfillment.type
      )
    );
  } catch (error) {
    console.error("Error parsing confirmFulfillments from Redis:", error);
    return false;
  }
}
