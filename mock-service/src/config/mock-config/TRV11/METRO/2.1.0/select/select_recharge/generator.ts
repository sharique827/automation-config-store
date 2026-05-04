import { masterOnSearchPayload } from "../../on_search/master_on_search_payload";

export async function selectRechargeGenerator(
  existingPayload: any,
  sessionData: any,
) {
  const rawData = sessionData.user_inputs;
  const user_input =
    typeof rawData === "string" ? JSON.parse(rawData) : rawData;
  existingPayload.context.location.city.code = user_input?.city_code;
  existingPayload.message.order.provider.id = user_input?.provider_id;
  const Item =
    masterOnSearchPayload?.message?.catalog?.providers[0]?.items?.find(
      (item: any) => {
        return item.id === user_input?.item_id;
      },
    );
  const metroPurchaseFulfillment =
    masterOnSearchPayload?.message?.catalog?.providers[0]?.fulfillments.find(
      (fulfillment: any) => {
        return fulfillment.id === user_input?.fulfillment_id;
      },
    );
  existingPayload.message.order.items = [
    {
      id: user_input?.item_id ?? "I3",
      price: {
        value: Item?.price?.value ?? "200",
      },
    },
  ];
  existingPayload.message.order.fulfillments = [
    {
      id: user_input?.fulfillment_id ?? "F3",
      type: "ONLINE",
      customer: {
        person: {
          creds: [
            {
              id: user_input?.card_identifier ?? "7ed21b6f",
              type: "CARD_IDENTIFIER",
            },
          ],
        },
      },
    },
  ];
  return existingPayload;
}
