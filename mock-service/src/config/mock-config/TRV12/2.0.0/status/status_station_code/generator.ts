import { SessionData } from "../../../session-types";

export async function statusGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;

  existingPayload.message.order_id = sessionData.order_id;
  return existingPayload;
}
