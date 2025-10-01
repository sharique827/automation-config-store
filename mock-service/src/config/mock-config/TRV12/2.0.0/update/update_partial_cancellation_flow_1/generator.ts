import { SessionData } from "../../../session-types";

export async function updateGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;
  existingPayload.message.update_target = "order.fulfillments";
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.fulfillments = [
    {
      id: "FT1",
      type: "TICKET",
      state: {
        descriptor: {
          code: "SOFT_CANCEL",
        },
      },
    },
  ];
  return existingPayload;
}
