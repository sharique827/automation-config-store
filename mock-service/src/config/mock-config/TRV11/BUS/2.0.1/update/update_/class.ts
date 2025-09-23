import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";

import { SessionData } from "../../../../session-types";
import { updateGenerator } from "./generator";

export class MockUpdateBus201Class extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./save-data.yaml"), "utf8")
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
    return "update_BUS_201";
  }
  get description(): string {
    return "Mock for update_BUS_201";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return updateGenerator(existingPayload, sessionData);
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {
    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
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

  // All requirements satisfied
  return { valid: true };
}
}
