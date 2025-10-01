import { SessionData } from "../../../session-types";

function generateSeatGridTag(
  x: string,
  y: string,
  z: string,
  seatNumber: string,
  gender: string,
  itemId: string
) {
  return {
    descriptor: { code: "SEAT_GRID" },
    list: [
      { descriptor: { code: "X" }, value: x },
      { descriptor: { code: "Y" }, value: y },
      { descriptor: { code: "Z" }, value: z },
      { descriptor: { code: "X_SIZE" }, value: "1" },
      { descriptor: { code: "Y_SIZE" }, value: "1" },
      { descriptor: { code: "NUMBER" }, value: seatNumber },
      { descriptor: { code: "RESTRICTED_GENDER" }, value: gender },
      { descriptor: { code: "SINGLE_SEAT" }, value: "TRUE" },
      { descriptor: { code: "SEAT_PRICE" }, value: "50" },
      { descriptor: { code: "ITEM_ID" }, value: itemId },
      { descriptor: { code: "AVAILABLE" }, value: "true" },
    ],
  };
}

export async function onSelectGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;
  const count = (sessionData?.selected_item_counts as number) ?? 0;
  existingPayload.message.order.items = sessionData.items?.filter(
    (item: any) => item.id === sessionData.select_items?.id
  );

  existingPayload.message.order.items.forEach((item: any) => {
    item.quantity = sessionData.selected_quantity;
    const newFulfillments = Array.from(
      { length: count },
      (_, i) => `FT${i + 1}`
    );
    item.fulfillment_ids = [
      ...(item.fulfillment_ids || []),
      ...newFulfillments,
    ];
    delete item.cancellation_terms;
  });

  const detailedFulfillment = sessionData?.fulfillments?.[0];
  const simplifiedStops = sessionData.fulfillment?.stops ?? [];

  const filteredStops = detailedFulfillment.stops.filter((stop: any) =>
    simplifiedStops.some((ss: any) => ss.id === stop.id)
  );
  const tags = [
    generateSeatGridTag("0", "0", "0", "A1", "FEMALE", "I1"),
    generateSeatGridTag("1", "0", "1", "F1", "MALE", "I1"),
    generateSeatGridTag("1", "1", "1", "F2", "MALE", "I1"),
    generateSeatGridTag("0", "1", "1", "A3", "MALE", "I1"),
  ];
  const updatedFulfillments = [
    {
      id: detailedFulfillment.id,
      type: detailedFulfillment.type,
      vehicle: detailedFulfillment.vehicle,
      stops: filteredStops,
      tags: tags,
    },
    ...Array.from({ length: count }, (_, i) => ({
      id: `FT${i + 1}`,
      type: "TICKET",
    })),
  ];
  existingPayload.message.order.fulfillments = updatedFulfillments;

  existingPayload.message.order.provider = {
    id: sessionData.provider_id,
    descriptor: sessionData.providers.descriptor,
  };

  return existingPayload;
}
