import { SessionData, Input } from "./session-types";
import { RedisService } from "ondc-automation-cache-lib";
import { SessionCache } from "../../../types/api-session-cache";
import { createMockResponseFIS10_200 } from "./2.1.0/generaton-pipeline";
import { createBuyerUrl, createSellerUrl } from "../../../utils/request-utils";

export async function createMockResponse(
	session_id: string,
	sessionData: SessionData,
	action_id: string,
	input?: Input
) {
	console.log("createMockResponse", session_id, sessionData, action_id, input)
	RedisService.useDb(0);
	const api_session = (await RedisService.getKey(session_id)) ?? "";
	console.log(api_session);
	const data = JSON.parse(api_session) as SessionCache;
	const { version, usecaseId } = data;
	sessionData.user_inputs = input
	let payload: any = {};
	if (version === "2.1.0") {
		payload = await createMockResponseFIS10_200(action_id, sessionData);
	}
	if (data.npType === "BAP") {
		payload.context.bap_uri = data.subscriberUrl;
		payload.context.bpp_uri = createSellerUrl(data.domain, data.version);
	} else {
		if (payload.context.action !== "search") {
			payload.context.bpp_uri = data.subscriberUrl;
		}
		payload.context.bap_uri = createBuyerUrl(data.domain, data.version);
	}
	return payload;
} 