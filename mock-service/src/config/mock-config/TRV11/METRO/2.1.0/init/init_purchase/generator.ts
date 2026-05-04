import { SessionData } from "../../../../session-types";

export async function initPurchaseGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  existingPayload.context.location.city.code =
    sessionData?.select_city_code ?? "std:080";
  const metroPurchaseFulfillment = sessionData?.fulfillments
    ?.flat()
    .find((fulfillment: any) => {
      return fulfillment.type === "PASS";
    });
  existingPayload.message.order.provider.id =
    (sessionData as any)?.select_unlimited_pass_provider_id ?? "Provider1";
  existingPayload.message.order.items = [
    {
      id: sessionData?.selected_items?.[0]?.id ?? "itemid",
    },
  ];
  existingPayload.message.order.fulfillments = [
    {
      id: metroPurchaseFulfillment?.id ?? "Fulfillment2",
      customer: {
        contact: {
          email: "joe.adam@abc.org",
          phone: "+91-9999999999",
        },
        person: {
          name: "Joe Adam",
        },
      },
      type: metroPurchaseFulfillment?.type ?? "PASS",
    },
  ];
  existingPayload.message.order.payments[0].collected_by =
    sessionData?.user_inputs?.collected_by;
  return existingPayload;
}
