import { SessionData } from "../../../session-types";

export async function initDefaultGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";
  // existingPayload.message.order.items =
  //   sessionData?.select_2_items?.map((i: any) => {
  //     if (i.parent_item_id) {
  //       return i;
  //     }
  //     return {
  //       ...i,
  //       parent_item_id: i.id,
  //     };
  //   }) ?? [];
  existingPayload.message.order.items = sessionData?.select_2_items ?? [];

  existingPayload.message.order.billing = {
    name: "Joe Adams",
    phone: "+91-9988776655",
    tax_id: "GSTIN:22AAAAA0000A1Z5",
  };
  existingPayload.message.order.payments = [
    {
      collected_by: "BAP",
      status: "NOT-PAID",
      type: "PRE-ORDER",
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
                code: "SETTLEMENT_AMOUNT",
              },
              value: "10421",
            },
            {
              descriptor: {
                code: "SETTLEMENT_TYPE",
              },
              value: "upi",
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
              value: "https://api.example-bap.com/booking/terms",
            },
          ],
        },
      ],
    },
  ];

  const customer_array = [
    {
      person: {
        name: "Mr. John",
        age: "30",
        gender: "MALE",
        dob: "2000-03-23",
      },
      contact: {
        phone: "+91-9988776651",
        email: "john@yahoo.com",
      },
    },
    {
      person: {
        name: "Maria",
        age: "32",
        gender: "FEMALE",
        dob: "2000-03-23",
      },
      contact: {
        phone: "+91-9988776654",
        email: "maria@yahoo.com",
      },
    },
    {
      person: {
        name: "Nick",
        age: "32",
        gender: "MALE",
        dob: "1998-03-23",
      },
      contact: {
        phone: "+91-9988776650",
        email: "nick@yahoo.com",
      },
    },
    {
      person: {
        name: "Mr.  Adams",
        age: "30",
        gender: "MALE",
        dob: "2001-03-23",
      },
      contact: {
        phone: "+91-9988776656",
        email: "adams@yahoo.com",
      },
    },
    {
      person: {
        name: "Mr. Alexender",
        age: "30",
        gender: "MALE",
        dob: "2001-03-23",
      },
      contact: {
        phone: "+91-9988776658",
        email: "alexender@yahoo.com",
      },
    },
  ];

  const fulfillments = sessionData?.on_select_2_fulfillments.map(
    (item: any, index: number) => {
      if (item?.id?.includes("-")) {
        return { id: item?.id, customer: customer_array[0] };
      } else {
        const { id, stops, vehicle } = item;
        const simplifiedStops = stops.map((stop: any) => ({ id: stop.id }));
        return { id, stops: simplifiedStops, vehicle };
      }
    }
  );

  existingPayload.message.order.fulfillments = fulfillments;

  return existingPayload;
}
