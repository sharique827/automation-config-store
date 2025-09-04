import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { updateConfirmPartialCancellationGenerator } from "./generator";

export class MockUpdateConfirmPartialCancellationClass extends MockAction {
    get saveData(): saveType {
        return yaml.load(
            readFileSync(path.resolve(__dirname, "./save-data.yaml"), "utf8")
        ) as saveType;
    }
    get defaultData(): any {
        return {};
    }
    get inputs(): any {
        return {};
    }
    name(): string {
        return "update_confirm_partial_cancellation";
    }
    get description(): string {
        return "Mock for update confirm partial cancellation";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return updateConfirmPartialCancellationGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate that we have selected items with quantity > 1
        if (!sessionData.selected_items || sessionData.selected_items.length === 0) {
            return { 
                valid: false, 
                message: "No selected items available for cancellation",
                code: "MISSING_SELECTED_ITEMS"
            };
        }
        
        const selectedItem = sessionData.selected_items[0];
        if (!selectedItem.quantity?.selected?.count || selectedItem.quantity.selected.count < 2) {
            return { 
                valid: false, 
                message: "Selected item quantity must be at least 2 for partial cancellation",
                code: "INSUFFICIENT_QUANTITY"
            };
        }
        
        return { valid: true };
    }
}