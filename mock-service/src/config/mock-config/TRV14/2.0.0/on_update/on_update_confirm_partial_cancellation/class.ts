import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { onUpdateConfirmPartialCancellationGenerator } from "./generator";

export class MockOnUpdateConfirmPartialCancellationClass extends MockAction {
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
        return "on_update_confirm_partial_cancellation";
    }
    get description(): string {
        return "Mock for on_update confirm partial cancellation";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onUpdateConfirmPartialCancellationGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data
        if (!sessionData.items || !sessionData.selected_items) {
            return { 
                valid: false, 
                message: "Missing items or selected_items in session",
                code: "MISSING_SESSION_DATA"
            };
        }
        
        if (!sessionData.quote) {
            return { 
                valid: false, 
                message: "Missing quote in session data",
                code: "MISSING_QUOTE"
            };
        }
        
        return { valid: true };
    }
}