import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { statusGenerator } from "./generator";
import { SessionData } from "../../../../session-types";

export class MockStatusBus201Class extends MockAction {
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
    return "status_BUS_201";
  }
  get description(): string {
    return "Mock for status_BUS_201";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return statusGenerator(existingPayload, sessionData);
  }
  async validate(
  targetPayload: any,
  sessionData: SessionData
): Promise<MockOutput> {
  const payloadTxnId = targetPayload?.message?.ref_id;
  const sessionTxnId = sessionData?.transaction_id;

  if (payloadTxnId !== sessionTxnId) {
    return {
      valid: false,
      message: `Order ID mismatch. Expected ${sessionTxnId}, got ${payloadTxnId}`,
    };
  }
  return { valid: true };
}
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
  // Check for transaction_id
  if (!sessionData.transaction_id) {
    return {
      valid: false,
      message: "No transaction_id available in session data",
      code: "MISSING_TRANSACTION_ID",
    };
  }

  // All requirements satisfied
  return { valid: true };
}
}
