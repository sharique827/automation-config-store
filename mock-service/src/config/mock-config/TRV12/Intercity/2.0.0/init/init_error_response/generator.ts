import { SessionData } from "../../../../session-types";

export async function initGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;

  existingPayload.message.order.items = sessionData.items?.map(
    ({ id, quantity }) => ({
      id,
      quantity,
    })
  );
  const customers = [
    {
      contact: { phone: "+91-9988776655" },
      person: { age: "30", gender: "MALE", name: "Joe Adams" },
    },
    {
      contact: { phone: "+91-9723797890" },
      person: { age: "27", gender: "FEMALE", name: "RACHEL ADAMS" },
    },
  ];

  existingPayload.message.order.fulfillments = sessionData.fulfillments?.map(
    (
      f: { id: string; stops: any[]; type: string; tags: any[] },
      index: number
    ) => {
      if (f.id === "F1") {
        return {
          id: f.id,
          stops: f.stops?.map((s: any) => ({
            id: s.id,
            type: s.type,
          })),
        };
      }

      if (f.type === "TICKET") {
        return {
          id: f.id,
          customer: customers[index - 1],
          tags: f.tags?.map((tag: any) => ({
            descriptor: tag.descriptor,
            list: tag.list.filter((l: any) => l.descriptor.code === "NUMBER"),
          })),
        };
      }

      return f;
    }
  );

  existingPayload.message.order.provider = {
    id: sessionData.provider.id,
  };
  existingPayload.message.order.billing = {
    name: "Joe Adams",
    phone: "+91-9988776655",
    tax_id: "GSTIN:22AAAAA0000A1Z5",
  };

  return existingPayload;
}
