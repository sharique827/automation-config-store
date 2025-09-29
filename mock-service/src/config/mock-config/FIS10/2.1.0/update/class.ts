import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { updateDefaultGenerator } from "./generator";

export class MockUpdateClass extends MockAction {
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
        return "update";
    }
    get description(): string {
        return "Mock for update";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return updateDefaultGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        if (!sessionData.transaction_id) {
            return { 
                valid: false, 
                message: "No transaction_id available in session data" 
            };
        }
        return { valid: true };
    }
} 