import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { search2Generator} from "./generator";

import { exampleFullfillment } from "../../on_search/fullfillment-generator";

export class MockSearch2Metro210Class extends MockAction {
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
    return "search2_METRO_210";
  }
  get description(): string {
    return "Mock for search_BUS_210";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return search2Generator(existingPayload, sessionData);
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {
    const stops = targetPayload.message.intent.fulfillment.stops;
    const startStop = stops.find((s: any) => s.type === "START");
    const endStop = stops.find((s: any) => s.type === "END");

    const startCode = startStop?.location?.descriptor?.code;
    const endCode = endStop?.location?.descriptor?.code;

    const validStops = exampleFullfillment.fulfillments[0].stops;
    const validCodes = validStops.map((s: any) => s.location.descriptor.code);

    if (!startCode || !validCodes.includes(startCode)) {
      return {
        valid: false,
        message: `Invalid start station code: ${startCode}. It must be one of the stations present in the catalog.`,
      };
    }

    if (!endCode || !validCodes.includes(endCode)) {
      return {
        valid: false,
        message: `Invalid end station code: ${endCode}. It must be one of the stations present in the catalog.`,
      };
    }

    const startIndex = validCodes.indexOf(startCode);
    const endIndex = validCodes.indexOf(endCode);

    if (endIndex <= startIndex) {
      return {
        valid: false,
        message: `End station (${endCode}) must be after start station (${startCode}).`,
      };
    }

    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    // Validate required session data for confirm generator
    return { valid: true };
  }
}
