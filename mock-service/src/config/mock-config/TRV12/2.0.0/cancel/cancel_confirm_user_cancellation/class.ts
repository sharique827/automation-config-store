import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { cancelConfirmUserCancellationGenerator } from "./generator";

export class MockCancelConfirmUserCancellationClass extends MockAction {
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
        return "cancel_confirm_user_cancellation";
    }
    get description(): string {
        return "Mock for cancel_confirm_user_cancellation";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return cancelConfirmUserCancellationGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        return { valid: true };
    }
} 