import { SessionData } from "../../session-types";

export async function searchDefaultGenerator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;

	// Set start and end date dynamically
	const now = new Date();
	const end = new Date(now);
	end.setDate(now.getDate() + 2);

	if (sessionData.user_inputs?.city_code) {
		existingPayload.context.location.city.code = sessionData.user_inputs.city_code;
	}

	console.log("sessionData.message_id in search generator", sessionData.message_id);

	return existingPayload;
} 