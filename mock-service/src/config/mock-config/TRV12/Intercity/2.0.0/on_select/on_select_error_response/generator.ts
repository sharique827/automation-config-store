import { SessionData } from "../../../../session-types";

export async function onSelectGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;

  existingPayload.message.order.items = sessionData.items?.map((i: any) => ({
    id: i.id,
    descriptor: { name: "Seater Ticket", code: "SEAT" },
    price: { currency: "INR", value: "800" },
    quantity: i.quantity,
    fulfillment_ids: ["F1", "FT1", "FT2"],
    category_ids: ["C1"],
  }));

  existingPayload.message.order.provider = {
    id: sessionData.provider.id,
    descriptor: {
      name: "ABC Operator 1 Bus Services",
      images: [{ url: "https://operator1.com/logos/logo.ico" }],
    },
  };

  existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
    (f: any) => {
      if (f.stops) {
        const vehicle = {
          category: "BUS",
          variant: "AC",
          capacity: 47,
          wheels_count: "6",
          energy_type: "DIESEL",
        };
        const stops = f.stops.map((s: any) => {
          const location =
            s.type === "PICKUP"
              ? {
                  descriptor: { name: "Agara", code: "std:080-pincode:560034" },
                  gps: "12.924479, 77.648999",
                }
              : {
                  descriptor: {
                    name: "Ameerpet",
                    code: "std:040-pincode:500016",
                  },
                  gps: "17.441586, 78.441581",
                };
          return {
            ...s,
            location,
            time: { label: "DATE_TIME", timestamp: new Date().toISOString() },
          };
        });
        return { ...f, type: "TRIP", stops, vehicle };
      }

      if (f.tags) {
        const tags = f.tags.map((tag: any) => {
          const numberTag =
            tag.list.find((l: any) => l.descriptor.code === "NUMBER")?.value ||
            "";
          const itemIdTag =
            tag.list.find((l: any) => l.descriptor.code === "ITEM_ID")?.value ||
            "";
          const baseValues = {
            X: f.id === "FT1" ? "0" : "1",
            Y: "0",
            Z: f.id === "FT1" ? "0" : "1",
            X_SIZE: "1",
            Y_SIZE: f.id === "FT1" ? "1" : "2",
            NUMBER: numberTag,
            RESTRICTED_GENDER: f.id === "FT1" ? "FEMALE" : "MALE",
            SINGLE_SEAT: "TRUE",
            SEAT_PRICE: "50",
            SELECTED: "true",
            SELECTED_SEAT: numberTag,
            ITEM_ID: itemIdTag,
          };
          return {
            ...tag,
            list: Object.entries(baseValues).map(([code, value]) => ({
              descriptor: { code },
              value,
            })),
          };
        });
        return { ...f, type: "TICKET", tags };
      }

      return f;
    }
  );

  return existingPayload;
}
