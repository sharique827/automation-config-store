import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../FIS10/classes/mock-action";
import { SessionData } from "../../../FIS10/session-types";
import { initDefaultGenerator } from "./generator";

export class MockInitClass extends MockAction {
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
        return "init";
    }
    get description(): string {
        return "Mock for init";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return initDefaultGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data for init generator
        if (!sessionData.transaction_id) {
            return { 
                valid: false, 
                message: "No transaction_id available in session data" 
            };
        }
        
        if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items) || sessionData.selected_items.length === 0) {
            return { 
                valid: false, 
                message: "No selected_items available in session data" 
            };
        }
        
        if (!sessionData.selected_fulfillments || !Array.isArray(sessionData.selected_fulfillments)) {
            return { 
                valid: false, 
                message: "No selected_fulfillments available in session data" 
            };
        }
        
        if (!sessionData.selected_provider) {
            return { 
                valid: false, 
                message: "No selected_provider available in session data" 
            };
        }
        
        return { valid: true };
    }
}
