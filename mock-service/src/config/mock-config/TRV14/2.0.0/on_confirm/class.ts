import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { onConfirmGenerator } from "./generator";

export class MockOnConfirmDefaultClass extends MockAction {
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
        return "on_confirm_default";
    }
    get description(): string {
        return "Mock for on_confirm_default";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onConfirmGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data for on_confirm generator
        if (!sessionData.items || !Array.isArray(sessionData.items)) {
            return { 
                valid: false, 
                message: "No items available in session data",
                code: "MISSING_ITEMS"
            };
        }

        if (sessionData.items.length === 0) {
            return {
                valid: false,
                message: "Items array is empty",
                code: "EMPTY_ITEMS"
            };
        }
        
        if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
            return { 
                valid: false, 
                message: "No fulfillments available in session data",
                code: "MISSING_FULFILLMENTS"
            };
        }

        if (sessionData.fulfillments.length === 0) {
            return {
                valid: false,
                message: "Fulfillments array is empty",
                code: "EMPTY_FULFILLMENTS"
            };
        }
        
        if (!sessionData.provider) {
            return { 
                valid: false, 
                message: "No provider available in session data",
                code: "MISSING_PROVIDER"
            };
        }
        
        if (!sessionData.quote) {
            return { 
                valid: false, 
                message: "No quote available in session data",
                code: "MISSING_QUOTE"
            };
        }

        if (!sessionData.billing) {
            return {
                valid: false,
                message: "No billing information available in session data",
                code: "MISSING_BILLING"
            };
        }

        if (!sessionData.payments || !Array.isArray(sessionData.payments)) {
            return {
                valid: false,
                message: "No payments available in session data",
                code: "MISSING_PAYMENTS"
            };
        }

        if (!sessionData.cancellation_terms || !Array.isArray(sessionData.cancellation_terms)) {
            return {
                valid: false,
                message: "No cancellation terms available in session data",
                code: "MISSING_CANCELLATION_TERMS"
            };
        }

        if (!sessionData.replacement_terms || !Array.isArray(sessionData.replacement_terms)) {
            return {
                valid: false,
                message: "No replacement terms available in session data",
                code: "MISSING_REPLACEMENT_TERMS"
            };
        }

        if (!sessionData.created_at) {
            return {
                valid: false,
                message: "No created_at timestamp available in session data",
                code: "MISSING_CREATED_AT"
            };
        }

        if (!sessionData.updated_at) {
            return {
                valid: false,
                message: "No updated_at timestamp available in session data",
                code: "MISSING_UPDATED_AT"
            };
        }
        
        return { valid: true };
    }
} 