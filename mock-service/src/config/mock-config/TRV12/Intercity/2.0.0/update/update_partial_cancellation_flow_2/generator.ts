import { SessionData } from "../../../../session-types";

export async function updateGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;
  existingPayload.message.update_target = "order.fulfillments";
  existingPayload.message.order.id = sessionData.order_id;
  return existingPayload;
}
