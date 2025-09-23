import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import {
  MockAction,
  MockOutput,
  saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { confirmGenerator } from "./generator";

export class MockConfirmBus201Class extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
    ) as saveType;
  }
  get defaultData(): any {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./default.yaml"), "utf8")
    );
  }
  get inputs(): any {
    return {};
  }
  name(): string {
    return "confirm_BUS_201";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return confirmGenerator(existingPayload, sessionData);
  }
  get description(): string {
    return "Mock for cancel_hard_BUS_201";
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {
    const items = targetPayload?.message?.order?.items || [];
    const fulfillments = targetPayload?.message?.order?.fulfillments || [];

    // Extract all fulfillment ids from payload
    const payloadFulfillmentIds = fulfillments.map((f: any) => f.id);

    for (const item of items) {
      // 1. check item id in sessionData.selected_item_ids
      if (!sessionData.selected_item_ids.includes(item.id)) {
        return {
          valid: false,
          message: `Item id ${item.id} not found in sessionData.selected_item_ids: ${sessionData.selected_item_ids}`,
        };
      }

      // 2. check item.fulfillment_ids are present in payload.fulfillments
      const itemFulfillmentIds = item.fulfillment_ids || [];
      if (
        !itemFulfillmentIds.every((fid: string) =>
          payloadFulfillmentIds.includes(fid)
        )
      ) {
        return {
          valid: false,
          message: `Item ${item.id} has invalid fulfillment ids. Expected subset of ${payloadFulfillmentIds}, got ${itemFulfillmentIds}`,
        };
      }

      // 3. check quantity within min and max for that item in sessionData.items
      const sessionItem = sessionData.items?.find((i: any) => i.id === item.id);
      const selectedCount = item?.quantity?.selected?.count;

      if (!sessionItem) {
        return {
          valid: false,
          message: `Item ${item.id} not found in sessionData.items`,
        };
      }

      const min = sessionItem?.quantity?.minimum?.count ?? 1;
      const max = sessionItem?.quantity?.maximum?.count ?? Infinity;

      if (selectedCount < min || selectedCount > max) {
        return {
          valid: false,
          message: `Item ${item.id} quantity out of range. Expected between ${min} and ${max}, got ${selectedCount}`,
        };
      }
    }
    const payments = targetPayload?.message?.order?.payments || [];
    const collectedBy = payments[0]?.collected_by;

  if (collectedBy !== sessionData.collected_by) {
    return {
      valid: false,
      message: `collected_by mismatch. Expected ${sessionData.collected_by}, got ${collectedBy}`,
    };
  }
    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
  // Check for billing
  if (!sessionData.billing) {
    return {
      valid: false,
      message: "No billing available in session data",
      code: "MISSING_BILLING",
    };
  }

  // Check for selected_items
  if (!sessionData.selected_items || sessionData.selected_items.length === 0) {
    return {
      valid: false,
      message: "No selected_items available in session data",
      code: "MISSING_SELECTED_ITEMS",
    };
  }

  // Check for provider_id
  if (!sessionData.provider_id) {
    return {
      valid: false,
      message: "No provider_id available in session data",
      code: "MISSING_PROVIDER_ID",
    };
  }

  // Check for payments
  if (!sessionData.payments || sessionData.payments.length === 0) {
    return {
      valid: false,
      message: "No payments available in session data",
      code: "MISSING_PAYMENTS",
    };
  }

  // Check for price
  if (!sessionData.price) {
    return {
      valid: false,
      message: "No price available in session data",
      code: "MISSING_PRICE",
    };
  }

  // All requirements satisfied
  return { valid: true };
}
}
