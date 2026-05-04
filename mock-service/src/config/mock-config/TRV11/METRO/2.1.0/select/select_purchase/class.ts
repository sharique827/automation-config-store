import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { selectPurchaseGenerator } from "./generator";
import { SessionData } from "../../../../session-types";
import { masterOnSearchPayload } from "../../on_search/master_on_search_payload";

export class MockSelectMetroPurchase210Class extends MockAction {
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
    return "select_METRO_PURCHASE_210";
  }
  get description(): string {
    return "Mock for select_METRO_PURCHASE_210";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return selectPurchaseGenerator(existingPayload, sessionData);
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
        if (catalogItem.descriptor?.code !== "PURCHASE") {
          return {
            valid: false,
            message: `Item ${item.id} is not of type 'PURCHASE'. Found type: ${catalogItem.descriptor?.code}.`,
          };
        }
  
        // 4. Item Price Value Check
        const selectedPriceValue = Number(item?.price?.value) || 0;
        const minPriceValue = Number(catalogItem.price?.minimum_value) || 0;
        const maxPriceValue = Number(catalogItem.price?.maximum_value) || Infinity;

        if (selectedPriceValue < minPriceValue || selectedPriceValue > maxPriceValue) {
          return {
            valid: false,
            message: `Price value ${selectedPriceValue} for item ${item.id} is out of range. Expected between ${minPriceValue} and ${maxPriceValue} in master catalog.`,
          };
        }
      }
  
      // 3. Fulfillment ID Existence and Type Check
      for (const fulfillment of fulfillments) {
        const catalogFulfillment = provider.fulfillments.find(
          (f: any) => f.id === fulfillment.id,
        );
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
      }
  
      return { valid: true };
    }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
  return { valid: true };
}
}
