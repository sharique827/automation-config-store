import { masterOnSearchPayload } from "../../on_search/master_on_search_payload";

/**
 * Parses an ISO 8601 duration string (e.g. "P1D", "P7D", "PT2H", "P1Y2M3DT4H5M6S")
 * and returns a new Date that is the given base date offset by that duration.
 */
function addIsoDuration(base: Date, duration: string): Date {
  const match = duration.match(/P(\d+)D/);
  if (!match) return base;
  const days = parseInt(match[1]);
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return result;
}

export async function onSelectUnlimitedPassGenerator(
  existingPayload: any,
  sessionData: any,
) {
  const masterOnSearch = masterOnSearchPayload?.message?.catalog?.providers[0];
  const date = new Date().toISOString();

  existingPayload.context.location.city.code =
    sessionData?.select_city_code ?? "std:080";

  const Items = masterOnSearch?.items?.find((item: any) => {
    return item.id === sessionData?.selected_unlimited_pass_item?.id;
  });
  const Fulfillments = masterOnSearch?.fulfillments?.find(
    (fulfillment: any) => {
      return (
        fulfillment.id === sessionData?.selected_unlimited_pass_fulfillments?.id
      );
    },
  );

  existingPayload.message.order.items = [
    {
      id: Items?.id ?? "I5",
      descriptor: Items?.descriptor ?? {},
      category_ids: Items?.category_ids ?? [],
      fulfillment_ids: [sessionData?.selected_unlimited_pass_fulfillments?.id],
      price: Items?.price ?? {},
      quantity: sessionData?.selected_unlimited_pass_item?.quantity ?? {},
      time: Items?.time ?? {},
    },
  ];
  const itemDuration =
    existingPayload.message.order.items[0]?.time?.duration ?? "P1D";
  const endDate = addIsoDuration(new Date(), itemDuration);

  existingPayload.message.order.items[0].time.timestamp = date;
  existingPayload.message.order.items[0].time.range = {
    start: date,
    end: endDate.toISOString(),
  };

  existingPayload.message.order.fulfillments = [
    {
      id: Fulfillments?.id ?? "F2",
      type: Fulfillments?.type ?? "PASS",
      customer:
        sessionData?.selected_unlimited_pass_fulfillments?.customer ?? {},
      stops: Fulfillments?.stops ?? [],
      vehicle: Fulfillments?.vehicle ?? {},
      tags: Fulfillments?.tags ?? [],
    },
  ];

  const today = date.split("T")[0];
  existingPayload.message.order.provider = {
    id: sessionData?.select_unlimited_pass_provider_id ?? "P1",
    descriptor: masterOnSearch?.descriptor ?? {},
    time: {
      range: {
        start: `${today}T05:30:00.000Z`,
        end: `${today}T23:30:00.000Z`,
      },
    },
  };

  const count =
    sessionData?.selected_unlimited_pass_item?.quantity?.selected?.count ?? 1;
  const unitPrice = Number(Items?.price?.value ?? 0);
  const totalValue = String(unitPrice * count);
  const currency = Items?.price?.currency ?? "INR";

  existingPayload.message.order.quote = {
    price: {
      value: totalValue,
      currency: currency,
    },
    breakup: [
      {
        title: "BASE_FARE",
        item: {
          id: Items?.id ?? "I5",
          price: Items?.price ?? {},
          quantity: {
            selected: {
              count: count,
            },
          },
        },
        price: {
          currency: currency,
          value: totalValue,
        },
      },
      {
        title: "TAX",
        price: {
          currency: currency,
          value: "0",
        },
        item: {
          tags: [
            {
              descriptor: {
                code: "TAX",
              },
              list: [
                {
                  descriptor: {
                    code: "CGST",
                  },
                  value: "0",
                },
                {
                  descriptor: {
                    code: "SGST",
                  },
                  value: "0",
                },
              ],
            },
          ],
        },
      },
      {
        title: "OTHER_CHARGES",
        price: {
          currency: currency,
          value: "0",
        },
        item: {
          tags: [
            {
              descriptor: {
                code: "OTHER_CHARGES",
              },
              list: [
                {
                  descriptor: {
                    code: "SURCHARGE",
                  },
                  value: "0",
                },
              ],
            },
          ],
        },
      },
    ],
  };

  return existingPayload;
}
