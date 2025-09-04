import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { search_incremental_pull_generator } from "./generator";
export class search_incremental_pull_class extends MockAction {
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
		return "search";
	}
	get description(): string {
		return "Mock action for searching items in TRV14.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return search_incremental_pull_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		return {
			valid: true,
		};
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.user_inputs?.city_code) {
			return {
				valid: false,
				message: "City code is required in user_inputs",
				code: "MISSING_CITY_CODE"
			};
		}
		return {
			valid: true,
		};
	}
} 