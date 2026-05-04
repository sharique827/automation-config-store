import { masterOnSearchPayload } from "../../on_search/master_on_search_payload";

export async function selectUnlimitedPassGenerator(
  existingPayload: any,
  sessionData: any,
) {
  const rawData = sessionData.user_inputs;
  const user_input =
    typeof rawData === "string" ? JSON.parse(rawData) : rawData;
  existingPayload.context.location.city.code = user_input?.city_code
  const metroPurchaseFulfillment = masterOnSearchPayload?.message?.catalog?.providers[0]?.fulfillments
    .find((fulfillment: any) => {
      return fulfillment.id === user_input?.fulfillment_id;
    });

  existingPayload.message.order.provider.id = user_input?.provider_id ?? "PROVIDER01";
  existingPayload.message.order.items = [
    {
      id: user_input?.item_id ?? "PurchaseItemIdI3",
      quantity: {
        selected: {
          count: Number(user_input?.item_quantity ?? 1),
        },
      },
    },
  ];
  existingPayload.message.order.fulfillments = [
    {
      id: user_input?.fulfillment_id ?? "PurchaseFulfillmentIdF3",
      type: "PASS",
      customer: {
        person: {
          creds: [
            {
              type: user_input?.cred_type ?? "AADHAAR",
              id: user_input?.cred_value ?? "1234 5678 9193",
            },
          ],
        },
      },
    },
  ];

  return existingPayload;
}
