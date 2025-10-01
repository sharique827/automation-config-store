import { SessionData } from "../../../session-types";

export async function onSearchGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const payload = { ...existingPayload };

  if (sessionData?.city_code) {
    payload.context.location.city.code = sessionData.city_code;
  }

  for (const provider of payload.message?.catalog?.providers ?? []) {
    for (const fulfillment of provider.fulfillments ?? []) {
      for (const stop of fulfillment.stops ?? []) {
        if (stop.type === "START" && sessionData?.start_location) {
          stop.location.descriptor.code = sessionData.start_location;
        }
        if (stop.type === "END" && sessionData?.user_inputs?.end_code) {
          stop.location.descriptor.code = sessionData.user_inputs?.end_code;
        }
        const [, pincode] = stop.location.descriptor.code.split("-pincode:");
        if (stop.type === "PICKUP") {
          stop.location.descriptor.code = `${sessionData.start_location}-pincode:${pincode}`;
        }
        if (stop.type === "DROP") {
          stop.location.descriptor.code = `${sessionData.start_location}-pincode:${pincode}`;
        }
      }
    }
  }

  return payload;
}
