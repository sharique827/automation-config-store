import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { onCancelSoftGenerator } from "./generator";
import { SessionData } from "../../../../session-types";

export class MockOnCancelSoftBus200Class extends MockAction {
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
    return "on_cancel_soft_BUS_200";
  }
  get description(): string {
    return "Mock for on_cancel_soft_BUS_200";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return onCancelSoftGenerator(existingPayload, sessionData);
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {
    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    // Validate required session data for confirm generator
    return { valid: true };
  }
}
