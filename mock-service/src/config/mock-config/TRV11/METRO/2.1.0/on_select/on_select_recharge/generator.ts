import { masterOnSearchPayload } from "../../on_search/master_on_search_payload";

export async function onSelectRechargeGenerator(
  existingPayload: any,
  sessionData: any,
) {
  const masterOnSearch = masterOnSearchPayload?.message?.catalog?.providers[0];

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
      id: Items?.id ?? "I3",
      category_ids: Items?.category_ids ?? [],
      descriptor: Items?.descriptor ?? {},
      fulfillment_ids: [sessionData?.selected_unlimited_pass_fulfillments?.id],
      price: {
        currency: Items?.price?.currency ?? "INR",
        value: sessionData?.selected_unlimited_pass_item?.price?.value ?? "200",
      },
    },
  ];

  existingPayload.message.order.fulfillments = [
    {
      id: Fulfillments?.id ?? "F2",
      stops: [
        {
          instructions: {
            name: "How to use?",
            short_desc: "short description about how to use?",
            long_desc: "Description about how to use?",
          },
        },
      ],
      customer: sessionData?.selected_unlimited_pass_fulfillments?.customer,
      type: Fulfillments?.type ?? "PASS",
    },
  ];

  existingPayload.message.order.provider = {
    id: sessionData?.select_unlimited_pass_provider_id ?? "P1",
    descriptor: masterOnSearch?.descriptor ?? {},
  };

  // ── Dynamic Quote ─────────────────────────────────────────────
  const currency = Items?.price?.currency ?? "INR";
  const baseFarePrice = Number(
    sessionData?.selected_unlimited_pass_item?.price?.value ?? 0,
  );

  // Tax: CGST 2% + SGST 2% of base fare
  const cgstPct = 0.02;
  const sgstPct = 0.02;
  const taxValue = baseFarePrice * (cgstPct + sgstPct);

  // Static line items
  const convenienceFee = 10;
  const otherCharges = 0;
  const offer = -10;

  const totalValue =
    baseFarePrice + convenienceFee + taxValue + otherCharges + offer;

  existingPayload.message.order.quote = {
    id: "Q1",
    price: {
      value: String(totalValue),
      currency,
    },
    breakup: [
      {
        title: "BASE_FARE",
        item: {
          id: Items?.id ?? "I3",
          price: {
            currency,
            value: String(baseFarePrice),
          },
        },
      },
      {
        title: "CONVENIENCE_FEE",
        price: {
          currency,
          value: String(convenienceFee),
        },
      },
      {
        title: "TAX",
        price: {
          currency,
          value: String(taxValue),
        },
        item: {
          tags: [
            {
              descriptor: { code: "TAX" },
              list: [
                {
                  descriptor: { code: "CGST" },
                  value: "2%",
                },
                {
                  descriptor: { code: "SGST" },
                  value: "2%",
                },
              ],
            },
          ],
        },
      },
      {
        title: "OTHER_CHARGES",
        price: {
          currency,
          value: String(otherCharges),
        },
        item: {
          tags: [
            {
              descriptor: { code: "OTHER_CHARGES" },
              list: [
                {
                  descriptor: { code: "SURCHARGE" },
                  value: "0",
                },
              ],
            },
          ],
        },
      },
      {
        title: "OFFER",
        price: {
          currency,
          value: String(offer),
        },
      },
    ],
  };
  return existingPayload;
}
