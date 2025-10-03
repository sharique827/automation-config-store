import { SessionData } from "../../../../session-types";

export async function confirmGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;

  existingPayload.message.order.items = [sessionData.select_items];
  existingPayload.message.order.fulfillments = sessionData.fulfillments;
  existingPayload.message.order.provider = { id: sessionData.provider_id };
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.payments = sessionData.payments?.map(
    (p: any) => ({
      ...p,
      params: {
        ...p.params,
        transaction_id: "a1644304-d150-4a58-93fe-69e8ab6e3cdc",
        currency: "INR",
        amount: sessionData.quote.price.value,
      },
    })
  );
  return existingPayload;
}
