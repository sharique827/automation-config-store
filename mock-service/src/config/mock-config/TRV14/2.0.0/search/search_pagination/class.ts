import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { search_seller_pagination_generator } from "./generator";

export class search_seller_pagination_class extends MockAction {
	get saveData(): saveType {
		return yaml.load(
			readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
		) as saveType;
	}
	get defaultData(): any {
		return yaml.load(
			readFileSync(
				path.resolve(__dirname, "./default.yaml"),
				"utf8"
			)
		);
	}
	get inputs(): any {
		return {};
	}
	name(): string {
		return "search_seller_pagination";
	}
	get description(): string {
		return "Mock for search_seller_pagination";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return search_seller_pagination_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.user_inputs?.city_code) {
			return {
				valid: false,
				message: "City code is required in user_inputs",
				code: "MISSING_CITY_CODE",
			};
		}
		return { valid: true };
	}
}
