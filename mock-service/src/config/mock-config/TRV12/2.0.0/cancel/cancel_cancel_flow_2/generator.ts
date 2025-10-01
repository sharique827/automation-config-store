import { v4 as uuidv4 } from "uuid";

export async function cancelGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.location.city.code = sessionData.city_code;
  existingPayload.message.order_id = sessionData.order_id;
  existingPayload.message.cancellation_reason_id =
    sessionData.cancellation_reason_id;
  existingPayload.message.descriptor = {
    name: "Ride Cancellation",
    code: "CONFIRM_CANCEL",
  };

  return existingPayload;
}
