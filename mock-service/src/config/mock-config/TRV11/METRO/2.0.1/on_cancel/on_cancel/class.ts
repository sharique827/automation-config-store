import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import {
  MockAction,
  MockOutput,
  saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { onCancelGenerator } from "./generator";

export class OnCancelMetro201Class extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
    ) as saveType;
  }
  get defaultData(): any {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "../default.yaml"), "utf8")
    );
  }
  get inputs(): any {
    return {};
  }
  name(): string {
    return "on_cancel_METRO_201";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return onCancelGenerator(existingPayload, sessionData);
  }
  get description(): string {
    return "Mock for on_cancel_METRO_201";
  }
  async validate(
  targetPayload: any,
  sessionData: SessionData
): Promise<MockOutput> {
  
  return { valid: true };
}

  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
  // Check for updated_payments
  if (!sessionData.updated_payments || sessionData.updated_payments.length === 0) {
    return {
      valid: false,
      message: "No updated_payments available in session data",
      code: "MISSING_UPDATED_PAYMENTS",
    };
  }

  // Check for items
  if (!sessionData.items || sessionData.items.length === 0) {
    return {
      valid: false,
      message: "No items available in session data",
      code: "MISSING_ITEMS",
    };
  }

  // Check for fulfillments
  if (!sessionData.fulfillments || sessionData.fulfillments.length === 0) {
    return {
      valid: false,
      message: "No fulfillments available in session data",
      code: "MISSING_FULFILLMENTS",
    };
  }

  // Check for order_id
  if (!sessionData.order_id) {
    return {
      valid: false,
      message: "No order_id available in session data",
      code: "MISSING_ORDER_ID",
    };
  }

  // Check for quote
  if (!sessionData.quote) {
    return {
      valid: false,
      message: "No quote available in session data",
      code: "MISSING_QUOTE",
    };
  }

  // Check for created_at
  if (!sessionData.created_at) {
    return {
      valid: false,
      message: "No created_at available in session data",
      code: "MISSING_CREATED_AT",
    };
  }

  // All requirements satisfied
  return { valid: true };
}
}
