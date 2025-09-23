import { SessionData } from "../../../session-types";

export async function search_1_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;

	// // start and end date
	// const currentTimeStamp = new Date(existingPayload.context.timestamp);
	// existingPayload.message.intent.fulfillment.stops[0].time.range.start = currentTimeStamp.toISOString();
	// const endDate = new Date(currentTimeStamp);
	// endDate.setDate(endDate.getDate() + 2);
	// existingPayload.message.intent.fulfillment.stops[0].time.range.end = endDate.toISOString();

	return existingPayload;
} 