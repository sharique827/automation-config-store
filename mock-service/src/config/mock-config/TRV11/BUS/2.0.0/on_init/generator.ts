import { SessionData } from "../../../session-types";

export async function onInitGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const randomId = Math.random().toString(36).substring(2, 15);

  const payments = [
    {
      id: randomId,
      collected_by: "BAP",
      status: "NOT-PAID",
      type: "PRE-ORDER",
      params: {
        bank_code: "XXXXXXXX",
        bank_account_number: "xxxxxxxxxxxxxx",
      },
      tags: [
        {
          descriptor: {
            code: "BUYER_FINDER_FEES",
          },
          display: false,
          list: [
            {
              descriptor: {
                code: "BUYER_FINDER_FEES_PERCENTAGE",
              },
              value: "1",
            },
            {
              descriptor: {
                code: "BUYER_FINDER_FEES_TYPE",
              },
              value: "percent-annualized",
            },
          ],
        },
        {
          descriptor: {
            code: "SETTLEMENT_TERMS",
          },
          display: false,
          list: [
            {
              descriptor: {
                code: "SETTLEMENT_WINDOW",
              },
              value: "PT60M",
            },
            {
              descriptor: {
                code: "SETTLEMENT_BASIS",
              },
              value: "Delivery",
            },
            {
              descriptor: {
                code: "SETTLEMENT_TYPE",
              },
              value: "neft",
            },
            {
              descriptor: {
                code: "MANDATORY_ARBITRATION",
              },
              value: "true",
            },
            {
              descriptor: {
                code: "COURT_JURISDICTION",
              },
              value: "New Delhi",
            },
            {
              descriptor: {
                code: "DELAY_INTEREST",
              },
              value: "2.5",
            },
            {
              descriptor: {
                code: "STATIC_TERMS",
              },
              value: "https://www.abc.com/settlement-terms/",
            },
            {
              descriptor: {
                code: "SETTLEMENT_AMOUNT",
              },
              value: "70",
            },
          ],
        },
      ],
    },
  ];
  existingPayload.message.order.payments = payments;
  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }
  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  return existingPayload;
}
