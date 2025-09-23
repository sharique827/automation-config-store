import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { statusActiveGenerator } from "./generator";

export class MockStatusMetro201Class extends MockAction {
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
    return "status_METRO_201";
  }
  get description(): string {
    return "Mock for status_METRO_201";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return statusActiveGenerator(existingPayload, sessionData);
  }
  async validate(
  targetPayload: any,
  sessionData: SessionData
): Promise<MockOutput> {
  const payloadOrderId = targetPayload?.message?.order_id;
  const sessionOrderId = sessionData?.order_id;

  if (payloadOrderId !== sessionOrderId) {
    return {
      valid: false,
      message: `Order ID mismatch. Expected ${sessionOrderId}, got ${payloadOrderId}`,
    };
  }
  return { valid: true };
}
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    // Validate required session data for confirm generator
    return { valid: true };
  }
}
