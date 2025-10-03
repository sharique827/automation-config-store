import { SessionData } from "../../../../session-types";

export async function selectGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;
  existingPayload.message.order.fulfillments = transformFulfillments(
    sessionData.on_select_fulfillments?.[0],
    sessionData?.on_select_fulfillments_tags,
    sessionData
  );

  existingPayload.message.order.items = [sessionData.select_items];
  existingPayload.message.order.provider = { id: sessionData.provider_id };

  return existingPayload;
}

function transformFulfillments(
  fulfillments: any[],
  ticketTags: any[],
  sessionData: SessionData
) {
  return fulfillments.map((f) => {
    if (f.type === "TRIP") {
      return sessionData.select_fulfillments;
    } else if (f.type === "TICKET") {
      const filteredTags = [ticketTags].map((tag: any) => {
        if (tag.descriptor.code === "SEAT_GRID") {
          return {
            descriptor: tag.descriptor,
            list: [
              ...tag.list.filter(
                (item: any) =>
                  item.descriptor.code === "NUMBER" ||
                  item.descriptor.code === "ITEM_ID"
              ),
              {
                descriptor: { code: "SELECTED" },
                value: "true",
              },
            ],
          };
        }
        return tag;
      });

      return {
        id: f.id,
        tags: filteredTags,
      };
    }
    return f;
  });
}
