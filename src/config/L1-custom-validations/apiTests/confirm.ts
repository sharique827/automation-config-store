import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export async function confirm(payload: any): Promise<validationOutput> {
  const context = payload?.context;
  const domain = context?.domain;
  const action = context?.action;
  console.log(`Running validations for ${domain}/${action}`);

  const results: validationOutput = [];

  const validQuote = await validateQuote(payload);
  const validItems = await validateItems(payload);
  const validFulfillments = await validateFulfillments(payload);
  const validOrderDimensions = await validateOrderDimensions(payload);
  const acceptLSPterms = await validateLSPterms(payload);
  const validTAT = await validateTAT(payload);

  if (!validQuote) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Quote price does not match with /on_init`,
    });
  }

  if (!validItems) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Items array does not match with /on_init`,
    });
  }

  if (!validFulfillments) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Fulfillments array does not match with /on_init`,
    });
  }

  if (!validOrderDimensions) {
    results.push({
      valid: false,
      code: 60011,
      description: `LSP is unable to validate the order request : Order dimensions/weight does not match with /search`,
    });
  }

  if (!acceptLSPterms) {
    results.push({
      valid: false,
      code: 62501,
      description: `LSP is unable to validate the order request : LSP terms are not accepted by LBNP`,
    });
  }

  if (!validTAT) {
    results.push({
      valid: false,
      code: 60008,
      description: `LSP is unable to validate the order request : S2D TAT or avg pickup time are different from what was quoted earlier in /on_search`,
    });
  }

  if (results.length === 0) {
    results.push({ valid: true, code: 200 });
  }

  return results;
}

async function validateQuote(payload: Record<string, any>): Promise<boolean> {
  const transaction_id = payload?.context?.transaction_id;
  if (!transaction_id) return false;

  const quotePrice = payload?.message?.order?.quote?.price;
  if (!quotePrice) return false;

  await RedisService.setKey(
    `${transaction_id}:confirmQuote`,
    JSON.stringify({ quotePrice })
  );

  const onInitQuoteRaw = await RedisService.getKey(
    `${transaction_id}:onInitQuote`
  );
  if (!onInitQuoteRaw) return true;

  const onInitQuote = JSON.parse(onInitQuoteRaw);
  return quotePrice === onInitQuote?.price;
}

async function validateItems(payload: Record<string, any>): Promise<boolean> {
  const items = payload?.message?.order?.items;
  const transaction_id = payload?.context?.transaction_id;
  await RedisService.setKey(
    `${transaction_id}:confirmItems`,
    JSON.stringify({ items })
  );

  if (!Array.isArray(items) || !transaction_id) return false;

  let onInitItems: any = await RedisService.getKey(
    `${transaction_id}:onInitItems`
  );

  if (!onInitItems) return false;

  try {
    onInitItems = JSON.parse(onInitItems);
    onInitItems = onInitItems.items;
    if (!Array.isArray(onInitItems)) return false;
  } catch (error) {
    console.error("Error parsing onInitItems from Redis:", error);
    return false;
  }

  return items.every((item) =>
    onInitItems.some(
      (onInitItem) =>
        item.id === onInitItem.id &&
        JSON.stringify(item.fulfillment_id || []) ===
          JSON.stringify(onInitItem.fulfillment_id || []) &&
        JSON.stringify(item.fulfillment_ids || []) ===
          JSON.stringify(onInitItem.fulfillment_ids || []) &&
        item.category_id === onInitItem.category_id
    )
  );
}

async function validateFulfillments(
  payload: Record<string, any>
): Promise<boolean> {
  const fulfillments = payload?.message?.order?.fulfillments;
  const transaction_id = payload?.context?.transaction_id;
  await RedisService.setKey(
    `${transaction_id}:confirmFulfillments`,
    JSON.stringify({ fulfillments })
  );
  if (!Array.isArray(fulfillments) || !transaction_id) return false;

  let onInitFulfillments: any = await RedisService.getKey(
    `${transaction_id}:onInitFulfillments`
  );

  if (!onInitFulfillments) return false;

  try {
    onInitFulfillments = JSON.parse(onInitFulfillments);
    onInitFulfillments = onInitFulfillments.fulfillments;
    if (!Array.isArray(onInitFulfillments)) return false;
  } catch (error) {
    console.error("Error parsing onInitFulfillments from Redis:", error);
    return false;
  }

  return fulfillments.every((fulfillment) =>
    onInitFulfillments.some(
      (onInitFulfillment) =>
        fulfillment.id === onInitFulfillment.id &&
        fulfillment.type === onInitFulfillment.type
    )
  );
}

async function validateOrderDimensions(
  payload: Record<string, any>
): Promise<boolean> {
  const payloadDetails = payload.message.order["@ondc/org/payload_details"];
  const dimensions = payloadDetails?.dimensions;
  const weight = payloadDetails?.weight;
  const transaction_id = payload?.context?.transaction_id;

  if (!dimensions || !weight || !transaction_id) return false;

  let searchDimensions = await RedisService.getKey(
    `${transaction_id}:orderDimensions`
  );
  let searchWeight = await RedisService.getKey(`${transaction_id}:orderWeight`);

  try {
    searchDimensions = JSON.parse(searchDimensions).dimensions;
    searchWeight = JSON.parse(searchWeight).weight;
  } catch (error) {
    console.error("Error parsing order details from Redis:", error);
    return false;
  }

  function compareDimensions(obj1: any, obj2: any): boolean {
    return (
      obj1?.length?.unit === obj2?.length?.unit &&
      obj1?.length?.value === obj2?.length?.value &&
      obj1?.breadth?.unit === obj2?.breadth?.unit &&
      obj1?.breadth?.value === obj2?.breadth?.value &&
      obj1?.height?.unit === obj2?.height?.unit &&
      obj1?.height?.value === obj2?.height?.value
    );
  }

  function compareWeight(obj1: any, obj2: any): boolean {
    return obj1?.unit === obj2?.unit && obj1?.value === obj2?.value;
  }

  return (
    compareDimensions(dimensions, searchDimensions) &&
    compareWeight(weight, searchWeight)
  );
}

async function validateLSPterms(payload: Record<string, any>): Promise<boolean> {
  const tags = payload?.message?.order?.tags;

  if (!Array.isArray(tags)) return false;

  return tags.some(
    (tag) =>
      tag.code === "bap_terms" &&
      Array.isArray(tag.list) &&
      tag.list.some(
        (item: { code: string; value: string }) =>
          item.code === "accept_bpp_terms" && item.value === "yes"
      )
  );
}

async function validateTAT(payload: Record<string, any>): Promise<boolean> {
  const items = payload?.message?.order?.items;
  const fulfillments = payload?.message?.order?.fulfillments;
  const provider = payload?.message?.order?.provider?.id;
  const transaction_id = payload?.context?.transaction_id;

  if (!Array.isArray(items) || !Array.isArray(fulfillments) || !transaction_id)
    return false;

  let onSearchItemsRaw: any = await RedisService.getKey(
    `${transaction_id}:${provider}:onSearchItems`
  );
  let onSearchFulfillmentsRaw: any = await RedisService.getKey(
    `${transaction_id}:${provider}:onSearchFulfillments`
  );

  if (!onSearchItemsRaw || !onSearchFulfillmentsRaw) return false;

  try {
    const onSearchItems = JSON.parse(onSearchItemsRaw).items;
    const onSearchFulfillments = JSON.parse(onSearchFulfillmentsRaw).fulfillments;

    return items.every((item, idx) => {
      const corresponding = onSearchItems[idx];
      return (
        item["@ondc/org/time_to_ship"] === corresponding["@ondc/org/time_to_ship"]
      );
    }) && fulfillments.every((fulfillment, idx) => {
      const corresponding = onSearchFulfillments[idx];
      return (
        fulfillment["@ondc/org/TAT"] === corresponding["@ondc/org/TAT"]
      );
    });
  } catch (error) {
    console.error("Error validating TAT:", error);
    return false;
  }
}