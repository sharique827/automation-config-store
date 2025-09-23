import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { confirmGenerator } from "./generator";
import { SessionData } from "../../../session-types";

export class MockConfirmBus200Class extends MockAction {
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
    return "confirm_BUS_200";
  }
  get description(): string {
    return "Mock for confirm_BUS_200";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return confirmGenerator(existingPayload, sessionData);
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {
    const itemIds =
      targetPayload.message?.order?.items?.map((item: any) => item.id) || [];

    const allValid = itemIds.every((id: string) =>
      sessionData.selected_item_ids.includes(id)
    );

    if (!allValid) {
      return {
        valid: false,
        message: "Payload contains invalid item IDs",
        code: "INVALID_ITEM_ID",
      };
    }

    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    // Validate required session data for confirm generator
    if (
      !sessionData.selected_items ||
      !Array.isArray(sessionData.selected_items) ||
      sessionData.selected_items.length === 0
    ) {
      return {
        valid: false,
        message: "No selected_items available in session data",
      };
    }

    if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
      return {
        valid: false,
        message: "No selected_fulfillments available in session data",
      };
    }

    if (!sessionData.provider_id) {
      return {
        valid: false,
        message: "No selected_provider available in session data",
      };
    }

    if (!sessionData.transaction_id) {
      return {
        valid: false,
        message: "No transaction_id available in session data",
      };
    }

    if (!sessionData.quote) {
      return {
        valid: false,
        message: "No quote available in session data",
      };
    }

    return { valid: true };
  }
}
