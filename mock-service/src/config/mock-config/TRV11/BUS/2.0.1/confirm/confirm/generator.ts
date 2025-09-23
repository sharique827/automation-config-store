import { SessionData } from "../../../../session-types";
const { v4: uuidv4 } = require("uuid");

const transformPaymentsToPaid = (
  payments: any[],
  amount: any,
  currency = "INR"
) => {
  return payments.map((p: any) => {
    // if the payment is wrapped like {0: {...}}, unwrap it
    const payment = Array.isArray(p) ? p[0] : p[0] ?? p;

    return {
      ...payment,
      status: "PAID",
      params: {
        transaction_id: uuidv4(),
        currency,
        amount,
      },
    };
  });
};

export async function confirmGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.billing && Object.keys(sessionData.billing).length > 0) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.selected_items && sessionData.selected_items.length > 0) {
    existingPayload.message.order.items = sessionData.selected_items;
  }

  if (sessionData.provider_id) {
    existingPayload.message.order.provider.id = sessionData.provider_id;
  }

  if (sessionData.buyer_side_fulfillment_ids) {
    existingPayload.message.order.fulfillments =
      sessionData.buyer_side_fulfillment_ids;
  }

  if (sessionData.payments) {
    existingPayload.message.order.payments = transformPaymentsToPaid(
      sessionData.payments,
      sessionData.price
    );
  }

  return existingPayload;
}
