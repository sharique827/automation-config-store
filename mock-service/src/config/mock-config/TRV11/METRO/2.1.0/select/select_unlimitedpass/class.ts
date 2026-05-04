import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import {
  MockAction,
  MockOutput,
  saveType,
} from "../../../../classes/mock-action";
import { selectUnlimitedPassGenerator } from "./generator";
import { SessionData } from "../../../../session-types";
import { masterOnSearchPayload } from "../../on_search/master_on_search_payload";

export class MockSelectMetroUnlimitedPass210Class extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8"),
    ) as saveType;
  }
  get defaultData(): any {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "./default.yaml"), "utf8"),
    );
  }
  get inputs(): any {
    return {};
  }
  name(): string {
    return "select_METRO_UNLIMITEDPASS_210";
  }
  get description(): string {
    return "Mock for select_METRO_UNLIMITEDPASS_210";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return selectUnlimitedPassGenerator(existingPayload, sessionData);
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData,
  ): Promise<MockOutput> {
    const order = targetPayload?.message?.order;
    const providerId = order?.provider?.id;
    const items = order?.items || [];
    const fulfillments = order?.fulfillments || [];

    const providers = masterOnSearchPayload.message.catalog.providers;
    const provider = providers.find((p: any) => p.id === providerId);

    // 1. Provider ID Existence
    if (!provider) {
      return {
        valid: false,
        message: `Provider ID ${providerId} not found in master catalog.`,
      };
    }

    // 2. Item ID Existence and Type Check
    for (const item of items) {
      const catalogItem = provider.items.find((i: any) => i.id === item.id);
      if (!catalogItem) {
        return {
          valid: false,
          message: `Item ID ${item.id} not found for provider ${providerId} in master catalog.`,
        };
      }

      // Check if item has type PASS (either via category or descriptor code)
      // Based on master_on_search_payload, PASS items have descriptor.code === 'PASS'
      if (catalogItem.descriptor?.code !== "PASS") {
        return {
          valid: false,
          message: `Item ${item.id} is not of type 'PASS'. Found type: ${catalogItem.descriptor?.code}.`,
        };
      }

      // 4. Item Quantity Check
      const selectedCount = item?.quantity?.selected?.count || 0;
      const maxCount = catalogItem.quantity?.maximum?.count;
      if (maxCount !== undefined && selectedCount > maxCount) {
        return {
          valid: false,
          message: `Quantity ${selectedCount} for item ${item.id} exceeds maximum allowed: ${maxCount} in master catalog.`,
        };
      }
    }

    // 3. Fulfillment ID Existence and Type Check
    for (const fulfillment of fulfillments) {
      const catalogFulfillment = provider.fulfillments.find(
        (f: any) => f.id === fulfillment.id,
      );
      if (fulfillment.type !== "PASS") {
        return {
          valid: false,
          message: `Fulfillment ${fulfillment.id} type should be 'PASS'.`,
        };
      }
      if (!catalogFulfillment) {
        return {
          valid: false,
          message: `Fulfillment ID ${fulfillment.id} not found for provider ${providerId} in master catalog.`,
        };
      }

      // Check if fulfillment has type PASS
      if (catalogFulfillment.type !== "PASS") {
        return {
          valid: false,
          message: `Fulfillment ${fulfillment.id} is not of type 'PASS'. Found type: ${catalogFulfillment.type}.`,
        };
      }

      // 5. Creds Type Validation
      const allowedCredTypes = ["AADHAR", "DL", "PAN", "VOTER ID"];
      const creds = fulfillment.customer?.person?.creds || [];
      for (const cred of creds) {
        if (!allowedCredTypes.includes(cred.type)) {
          return {
            valid: false,
            message: `Invalid credential type: ${cred.type}. Allowed types are: ${allowedCredTypes.join(
              ", ",
            )}.`,
          };
        }
      }
    }

    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    return { valid: true };
  }
}
