import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../FIS10/classes/mock-action";
import { SessionData } from "../../../FIS10/session-types";
import { onSearchDefaultGenerator } from "./generator";

export class MockOnSearchClass extends MockAction {
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
        return {
        };
    }

    name(): string {
        return "on_search_full_pull";
    }
    get description(): string {
        return "Mock for on_search_full_pull";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onSearchDefaultGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {

        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {

        return { valid: true };
    }
}