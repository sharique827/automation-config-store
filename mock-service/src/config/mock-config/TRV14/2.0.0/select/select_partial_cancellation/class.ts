import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { selectPartialCancellationGenerator } from "./generator";

export class MockSelectPartialCancellationClass extends MockAction {
    get saveData(): saveType {
        return yaml.load(
            readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
        ) as saveType;
    }
    get defaultData(): any {
        return {};
    }
    get inputs(): any {
        return {};
    }
    name(): string {
        return "select_partial_cancellation";
    }
    get description(): string {
        return "Mock for select_partial_cancellation with quantity=2";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return selectPartialCancellationGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data for select generator
        if (!sessionData.items || !Array.isArray(sessionData.items) || sessionData.items.length === 0) {
            return { 
                valid: false, 
                message: "No items available in session data",
                code: "MISSING_ITEMS"
            };
        }
        
        if (!sessionData.provider_id) {
            return { 
                valid: false, 
                message: "No provider_id available in session data",
                code: "MISSING_PROVIDER_ID"
            };
        }
        
        return { valid: true };
    }
}