import { readFileSync } from "fs";
import logger from "@ondc/automation-logger";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionDataFIS11 } from "./FIS11/session-types";
import { createFIS11MockResponse } from "./FIS11/version-factory";
import { getFIS11MockAction, listFIS11MockActions } from "./FIS11/action-factory";

export { MockSessionDataFIS11 };
export { MockSessionDataFIS11 as MockSessionData };

const actionConfigFIS11 = yaml.load(
	readFileSync(path.join(__dirname, "./FIS11/factory.yaml"), "utf8")
) as any;

export const actionConfig = actionConfigFIS11;

export const defaultSessionDataFIS11 = () =>
	yaml.load(
		readFileSync(path.join(__dirname, "./FIS11/session-data.yaml"), "utf8")
	) as { session_data: MockSessionDataFIS11 };
	
export const defaultSessionData = defaultSessionDataFIS11;

export async function generateMockResponse(
	session_id: string,
	sessionData: any,
	action_id: string,
	input?: any
) {
	try {
		const domain = process.env.DOMAIN;
		let response;
		
		if (domain === "ONDC:FIS11") {
			response = await createFIS11MockResponse(
				session_id,
				sessionData,
				action_id,
				input
			);
		} else {
			throw new Error(`Domain ${domain} not supported`);
		}
		
		response.context.timestamp = new Date().toISOString();
		return response;
	} catch (e) {
		logger.error("Error in generating mock response", e);
		throw e;
	}
}

export function getMockActionObject(actionId: string) {
	const domain = process.env.DOMAIN;
	if (domain === "ONDC:FIS11") {
		return getFIS11MockAction(actionId);
	}
	throw new Error(`Domain ${domain} not supported`);
}

export function getAllMockActionIds() {
	return listFIS11MockActions();
}

export function getUiMetaKeys(): (keyof MockSessionDataFIS11)[] {
	return [];
}

export function getActionData(code: number) {
	const domain = process.env.DOMAIN;
	let actionConfig;
	
	if (domain === "ONDC:FIS11") {
		actionConfig = actionConfigFIS11;
	} else {
		throw new Error(`Domain ${domain} not supported`);
	}
	
	const actionData = actionConfig.codes.find(
		(action: any) => action.code === code
	);
	if (actionData) {
		return actionData;
	}
	throw new Error(`Action code ${code} not found`);
}

export function getSaveDataContent(version: string, action: string) {
	const domain = process.env.DOMAIN;
	let actionFolderPath;
	
	if (domain === "ONDC:FIS11") {
		actionFolderPath = path.resolve(
			__dirname,
			`./FIS11/${version}/${action}`
		);
	} else {
		throw new Error(`Domain ${domain} not supported`);
	}
	
	const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
	const fileContent = readFileSync(saveDataFilePath, "utf8");
	const cont = yaml.load(fileContent) as any;
	console.log(cont);
	return cont;
}
