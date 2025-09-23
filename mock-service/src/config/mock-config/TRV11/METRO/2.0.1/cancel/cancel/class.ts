import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import {
  MockAction,
  MockOutput,
  saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { cancelGenerator } from "./generator";

export class MockCancelMetro201Class extends MockAction {
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
    return "cancel_METRO_201";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return cancelGenerator(existingPayload, sessionData);
  }
  get description(): string {
    return "Mock for cancel_METRO_201";
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {
    const { order_id, descriptor } = targetPayload.message;
    
    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    if (!sessionData.order_id) {
      return {
        valid: false,
        message: "No order_id available in session data",
        code: "MISSING_ORDER_ID",
      };
    }

    return { valid: true };
  }
}
