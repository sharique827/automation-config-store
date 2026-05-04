import { v4 as uuidv4 } from "uuid";

const transformPaymentsToPaid = (
  payments: any,
  amount: any,
  currency = "INR",
) => {
  return payments.map((payment: any) => ({
    ...payment,
    status: "PAID",
    params: {
      transaction_id: uuidv4(), // Generates a UUID for transaction_id
      currency,
      amount,
    },
  }));
};

export async function confirmRechargeGenerator(
  existingPayload: any,
  sessionData: any,
) {
  existingPayload.context.location.city.code =
    sessionData?.select_city_code ?? "std:080";
  if (sessionData.billing && Object.keys(sessionData.billing).length > 0) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.selected_items && sessionData.selected_items.length > 0) {
    existingPayload.message.order.items = sessionData?.init_items?.flat() ?? [];
  }

  existingPayload.message.order.provider.id = sessionData.select_unlimited_pass_provider_id;

  if (sessionData.payments) {
    existingPayload.message.order.payments = transformPaymentsToPaid(
      sessionData.payments,
      sessionData.price,
    );
  }

  existingPayload.message.order.fulfillments =
    sessionData?.buyer_side_fulfillment_ids?.flat() ?? [];

  existingPayload.message.order.tags = [
    ...sessionData?.init_tags?.flat(),
    ...sessionData?.on_init_tags?.flat(),
  ];
  return existingPayload;
}
