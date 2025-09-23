import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { onSearchGenerator } from "./generator";
import { SessionData } from "../../../../session-types";

export class MockOnSearch1Bus201Class extends MockAction {
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
    return "on_search_BUS_201";
  }
  get description(): string {
    return "Mock for on_search_BUS_201";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return onSearchGenerator(existingPayload, sessionData);
  }
  async validate(
  targetPayload: any,
  sessionData: SessionData
): Promise<MockOutput> {
  const targetCityCode = targetPayload?.context?.location?.city?.code;
  if (targetCityCode !== sessionData.city_code) {
    return {
      valid: false,
      message: `City code mismatch: expected ${sessionData.city_code}, got ${targetCityCode}`
    };
  }

  const fulfillments = targetPayload?.message?.catalog?.providers?.[0]?.fulfillments || [];
  for (const fulfillment of fulfillments) {
    const stops = fulfillment?.stops || [];
    const startCode = stops.find((s: any) => s.type === "START")?.location?.descriptor?.code;
    const endCode = stops.find((s: any) => s.type === "END")?.location?.descriptor?.code;

    if (startCode !== sessionData.start_code || endCode !== sessionData.end_code) {
      return {
        valid: false,
        message: `Fulfillment ${fulfillment.id} start/end mismatch. Expected start=${sessionData.start_code}, end=${sessionData.end_code}, but got start=${startCode}, end=${endCode}`
      };
    }
  }

  return { valid: true };
}

  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
  // Check for collected_by
  if (!sessionData.collected_by) {
    return {
      valid: false,
      message: "No collected_by available in session data",
      code: "MISSING_COLLECTED_BY",
    };
  }

  // Check for buyer_app_fee
  if (
    sessionData.buyer_app_fee === undefined ||
    sessionData.buyer_app_fee === null
  ) {
    return {
      valid: false,
      message: "No buyer_app_fee available in session data",
      code: "MISSING_BUYER_APP_FEE",
    };
  }

  // Check for city_code
  if (!sessionData.city_code) {
    return {
      valid: false,
      message: "No city_code available in session data",
      code: "MISSING_CITY_CODE",
    };
  }

  // All good
  return { valid: true };
}
}
