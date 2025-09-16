import axios from "axios";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { validateFormHtml } from "./validate-form";
import { resolveFormActions } from "./resolve-action";

export class MockFirstFormTestingClass extends MockAction {
	name(): string {
		return "first_form_testing";
	}
	get description(): string {
		return "Mock for first_form_testing";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		throw new Error("Method not implemented.");
	}
	async validate(
		targetPayload: any,
		sessionData?: SessionData
	): Promise<MockOutput> {
		if (!sessionData) {
			return {
				valid: false,
				message: "Session data is required for validation",
			};
		}
		const formLink = sessionData["first_form_testing"];
		if (!formLink) {
			return { valid: false, message: "Form link not found in session data" };
		}
		const formRaw = await axios.get(formLink);
		const formData = formRaw.data;
		const r1 = validateFormHtml(formData);
		if (r1.ok === false) {
			return { valid: false, message: r1.errors.join("; ") };
		}
		return { valid: true };
	}

	override async __forceSaveData(
		sessionData: SessionData
	): Promise<Record<string, any>> {
		const formLink = sessionData["first_form_testing"];
		if (!formLink) {
			throw new Error("Form link not found in session data");
		}
		const formRaw = await axios.get(formLink);
		const formData = formRaw.data;
		return {
			...sessionData,
			first_form_testing: resolveFormActions(formLink, formData),
		};
	}

	meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		return Promise.resolve({ valid: true });
	}
	get saveData(): saveType {
		return {
			"save-data": {
				first_form_testing: "$.inputs.submission_id",
			},
		};
	}
	get defaultData(): any {
		return {};
	}
	get inputs(): any {
		return {};
	}
}
