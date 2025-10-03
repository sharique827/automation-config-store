import { SessionData } from "../../../../session-types";

export async function searchGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.context.location.city.code = sessionData.city_code;

  if (sessionData.fulfillments && sessionData.fulfillments.length > 0) {
    const firstFulfillment = sessionData.fulfillments[0];

    const pickupStop = firstFulfillment.stops?.find(
      (s: { type: string }) => s.type === "PICKUP"
    );
    const dropStop = firstFulfillment.stops?.find(
      (s: { type: string }) => s.type === "DROP"
    );

    existingPayload.message.intent.fulfillment = {
      id: firstFulfillment.id,
      stops: [
        pickupStop ? { id: pickupStop.id, type: pickupStop.type } : null,
        dropStop ? { id: dropStop.id, type: dropStop.type } : null,
      ].filter(Boolean),
      vehicle: firstFulfillment.vehicle,
    };
  }
  existingPayload.message.intent.provider = { id: sessionData.provider_id };

  return existingPayload;
}
