import { SessionData } from "../../../../session-types";

const categories = [
  {
    descriptor: {
      name: "Seater",
      code: "SEATER",
    },
    id: "C1",
  },
  {
    descriptor: {
      name: "Sleeper",
      code: "SLEEPER",
    },
    id: "C2",
  },
  {
    descriptor: {
      name: "Semi Sleeper",
      code: "SEMI_SLEEPER",
    },
    id: "C3",
  },
];

export async function onSearchGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData?.city_code) {
    existingPayload.context.location.city.code = sessionData.city_code;
  }
  if (sessionData?.catalog_descriptor) {
    existingPayload.message.catalog.descriptor =
      sessionData?.catalog_descriptor;
  }
  if (sessionData?.providers) {
    existingPayload.message.catalog.providers = [sessionData.providers];
    existingPayload.message.catalog.providers.forEach((provider: any) => {
      provider.categories = categories;

      provider.items = [
        {
          id: "I1",
          descriptor: {
            name: "Seater Ticket",
            code: "SEAT",
          },
          price: {
            currency: "INR",
            value: "899",
          },
          quantity: {
            available: { count: 1 },
            maximum: { count: 1 },
          },
          fulfillment_ids: ["F1"],
          category_ids: ["C1"],
          cancellation_terms: provider.items?.[0]?.cancellation_terms,
        },
        {
          id: "I2",
          descriptor: {
            name: "Sleeper Ticket",
            code: "SEAT",
          },
          price: {
            currency: "INR",
            value: "1299",
          },
          quantity: {
            available: { count: 1 },
          },
          fulfillment_ids: ["F2"],
          category_ids: ["C2"],
          cancellation_terms: provider.items?.[0]?.cancellation_terms,
        },
      ];
      if (sessionData.fulfillments) {
        provider.fulfillments = [sessionData.fulfillments[0]].map((f) => ({
          id: f.id,
          type: f.type,
          stops: f.stops,
          vehicle: f.vehicle,
        }));
      }
    });
  }

  return existingPayload;
}
