import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export async function init(payload: any): Promise<validationOutput> {
  // Extract payload, context, domain and action
  const context = payload?.context;
  const domain = context?.domain;
  const action = context?.action;
  console.log(`Running validations for ${domain}/${action}`);

  // Initialize results array
  const results: validationOutput = [];

  //validate items
  if (!(await validateItems(payload))) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Selected item does not exist in the catalog provided in /on_search`,
    });
  }

  // If no issues found, return a success result
  if (results.length === 0) {
    results.push({ valid: true, code: 200 });
  }
  console.log(results);

  return results;
}

/**
 * Validates that the items object is valid
 *
 * @param payload The request payload
 * @returns boolean indicating if validation passed
 */
async function validateItems(payload: Record<string, any>): Promise<boolean> {
  const items = payload?.message?.order?.items;
  const transaction_id = payload?.context?.transaction_id;
  const provider = payload?.message?.order?.provider?.id;
  if (!Array.isArray(items) || !transaction_id) return false;
  console.log("inside init L1 custom vals");

  let onSearchItems: any = await RedisService.getKey(
    `${transaction_id}:onSearchItems`
  );
  console.log("on_search", onSearchItems);

  if (!onSearchItems) return false;

  try {
    onSearchItems = JSON.parse(onSearchItems);
    if (!Array.isArray(onSearchItems)) return false;
  } catch (error) {
    console.error("Error parsing onInitItems from Redis:", error);
    return false;
  }
  const validItems = items.every((item) => {
    console.log("Checking item:", item.id);
    return onSearchItems.some((onSearchItem) => {
      console.log("Against onSearchItem:", onSearchItem.id);
      return (
        item.id === onSearchItem.id &&
        JSON.stringify(item.fulfillment_id || []) ===
          JSON.stringify(onSearchItem.fulfillment_id || []) &&
        JSON.stringify(item.fulfillment_ids || []) ===
          JSON.stringify(onSearchItem.fulfillment_ids || []) &&
        item.category_id === onSearchItem.category_id
      );
    });
  });

  console.log("Final item validation result:", validItems);
  return validItems;
}
