import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import {
  MockAction,
  MockOutput,
  saveType,
} from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { onSearch_2_Generator } from "./generator";

export class MockOnSearch_2 extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./save-data.yaml"), "utf8")
    ) as saveType;
  }
  get defaultData(): any {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./on_search_available_accomodation.yaml"), "utf8")
    );
  }
  get inputs(): any {
    return {};
  }
  name(): string {
    return "on_search_available_accomodation";
  }
  get description(): string {
    return "Mock for on_search_available_accomodation";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return onSearch_2_Generator(existingPayload, sessionData);
  }
  async validate(targetPayload: any): Promise<MockOutput> {
    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    return { valid: true };
  }
}
