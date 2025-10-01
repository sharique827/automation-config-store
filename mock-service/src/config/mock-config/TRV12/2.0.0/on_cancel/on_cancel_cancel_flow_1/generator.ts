import { v4 as uuidv4 } from "uuid";

export async function onCancelGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.context.location.city.code = sessionData.city_code;

  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.cancellation = {
    cancelled_by: "CONSUMER",
    time: new Date().toISOString(),
  };
  existingPayload.message.order.status = "SOFT-CANCEL";
  // existingPayload.message.order.items = sessionData.items
  // existingPayload.message.order.provider =  sessionData.provider ;
  existingPayload.message.order.cancellation_terms =
    sessionData?.cancellation_terms[0];
  existingPayload.message.order.payments = sessionData.payments;
  existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
    ({ state, ...f }: any) => f
  );
  existingPayload.message.order.quote = {
    ...sessionData.quote,
    breakup: [
      ...sessionData.quote.breakup.filter(
        (b: any) => b.title !== "SELLER_FEES"
      ),
      {
        price: { currency: "INR", value: "10" },
        title: "CANCELLATION_CHARGES",
      },
      {
        price: { currency: "INR", value: "-1773" },
        title: "REFUND",
      },
      ...sessionData.quote.breakup.filter(
        (b: any) => b.title === "SELLER_FEES"
      ),
    ],
    price: { currency: "INR", value: "10" },
  };

  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = sessionData.updated_at;
  return existingPayload;
}
