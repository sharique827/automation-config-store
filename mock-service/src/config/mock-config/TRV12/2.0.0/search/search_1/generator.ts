import { SessionData } from "../../../session-types";

export async function search_1_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  const date = new Date(existingPayload?.context?.timestamp);
  date.setMonth(date.getMonth() + 2);
  const fulfillmentTimestamp = date.toISOString();

  existingPayload.message.intent.fulfillment.stops = [
    {
      type: "START",
      location: {
        descriptor: {
          code: "DEL",
        },
      },
      time: {
        label: "Date Of Journey",
        timestamp: fulfillmentTimestamp ?? new Date().toISOString(),
      },
    },
    {
      type: "END",
      location: {
        descriptor: {
          code: "BLR",
        },
      },
    },
  ];

  return existingPayload;
}
