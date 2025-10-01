import { SessionData } from "../../../session-types";

export async function searchGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.context.location.city.code =
    sessionData.user_inputs?.city_code;
  existingPayload.message.intent.fulfillment.stops.forEach(
    (stop: {
      location: { descriptor: { code: any } };
      time: { timestamp: any };
    }) => {
      stop.location.descriptor.code = sessionData.user_inputs?.start_code;
    }
  );

  return existingPayload;
}

function getCurrentTime(): string {
  return new Date().toISOString();
}
