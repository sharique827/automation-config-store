import { v4 as uuidv4 } from "uuid";
export async function onConfirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.message.order.id = sessionData?.confirm_order_id ?? "O1";
  existingPayload.message.order.status = "ACTIVE";
  existingPayload.message.order.provider = sessionData?.on_init_provider ?? {};
  existingPayload.message.order.items = sessionData?.on_init_items ?? [];
  existingPayload.message.order.fulfillments =
    sessionData?.on_init_fulfillments ?? [];
  existingPayload.message.order.quote = sessionData?.on_init_quote ?? {};

  const payments = sessionData?.on_init_payments?.map((payment: any) => {
    return {
      ...payment,
      status: sessionData?.confirm_payments[0].status || "PAID",
      params: {
        transaction_id:
          sessionData?.confirm_payments[0]?.params?.transaction_id ?? "",
        currency: "INR",
        amount: sessionData?.confirm_payments[0]?.params?.amount ?? "0",
      },
    };
  });
  existingPayload.message.order.payments = payments ?? [];
  existingPayload.message.order.documents = [
    {
      descriptor: {
        code: "AIRLINE-DOC",
        name: "PNR Document",
        short_desc: "Download your ticket here",
        long_desc: "Download your ticket here",
      },
      mime_type: "application/pdf",
      url: "https://abcoperator.com/manage-booking/pnr/O1.pdf",
    },
  ];
  existingPayload.message.order.cancellation_terms = [
    {
      cancel_by: {
        duration: "PT60M",
      },
      cancellation_fee: {
        percentage: "0",
      },
    },
  ];
  existingPayload.message.order.billing = sessionData?.confirm_billing ?? {};
  existingPayload.message.order.created_at =
    existingPayload?.context?.timestamp ?? new Date().toISOString();
  existingPayload.message.order.updated_at =
    existingPayload?.context?.timestamp ?? new Date().toISOString();

  return existingPayload;
}

