import { randomUUID } from "crypto";

export async function confirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.message.order.id = `ORDER-ID${Math.floor(
    Math.random() * 100000000
  )}`;
  existingPayload.message.order.provider.id =
    sessionData?.init_provider_id ?? {};

  existingPayload.message.order.items = sessionData?.init_items ?? [];

  existingPayload.message.order.fulfillments =
    sessionData?.init_fulfillments ?? [];
  existingPayload.message.order.billing = sessionData?.init_billing ?? {};
  const payment = sessionData?.init_payments[0];
  payment.status="PAID";
  payment.id = "PA1";
  payment.params = {
    transaction_id: randomUUID(),
    currency: "INR",
    amount: sessionData?.on_init_quote?.price?.value || "0",
  };

  existingPayload.message.order.payments = sessionData?.init_payments;

  return existingPayload;
}
