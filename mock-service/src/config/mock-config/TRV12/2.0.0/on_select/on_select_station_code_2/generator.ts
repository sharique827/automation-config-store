import { SessionData } from "../../../session-types";

export async function onSelectGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code = sessionData.city_code;

  existingPayload.message.order.items = [sessionData.on_select_items];
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.fulfillments = transformFulfillments(
    sessionData.on_select_fulfillments?.[0],
    sessionData?.on_select_fulfillments_tags
  );
  existingPayload.message.order.quote = calculateQuote(sessionData);

  return existingPayload;
}

function calculateQuote(sessionData: SessionData) {
  const baseFarePerSeat = Number(sessionData.price.value);
  const seatFare = 50;
  const convenienceFee = 19;

  const seatCount = sessionData?.selected_item_counts ?? 0;
  const baseFare = baseFarePerSeat * seatCount;
  const tax = Math.round(baseFare * 0.06);

  const totalSeatFare = seatFare * seatCount;
  const total = baseFare + tax + convenienceFee + totalSeatFare;

  return {
    price: {
      value: total.toString(),
      currency: "INR",
    },
    breakup: [
      {
        title: "BASE_FARE",
        price: { currency: "INR", value: baseFare.toString() },
        item: {
          id: "I1",
          price: { currency: "INR", value: baseFarePerSeat.toString() },
          quantity: { selected: { count: seatCount } },
        },
      },
      {
        title: "TAX",
        price: { currency: "INR", value: tax.toString() },
        item: {
          tags: [
            {
              descriptor: { code: "TAX" },
              list: [
                { descriptor: { code: "CGST" }, value: "2%" },
                { descriptor: { code: "SGST" }, value: "2%" },
                { descriptor: { code: "SERVICE_TAX" }, value: "2%" },
              ],
            },
          ],
        },
      },
      {
        title: "CONVENIENCE_FEE",
        price: { currency: "INR", value: convenienceFee.toString() },
      },
      ...(sessionData.on_select_fulfillments || [])
        .filter((f: { type: string }) => f.type === "TICKET")
        .map((f: { id: any }, idx: number) => ({
          title: "SEAT_FARE",
          price: { currency: "INR", value: seatFare.toString() },
          item: { id: "I1", fulfillment_ids: [f.id ?? `FT${idx + 1}`] },
        })),
      {
        title: "SELLER_FEES",
        price: { currency: "INR", value: "0" },
        item: {
          tags: [
            {
              descriptor: { code: "SELLER_FEES" },
              list: [
                { descriptor: { name: "TotReservationFare" }, value: "0" },
                { descriptor: { name: "TotSRTFee" }, value: "0" },
                { descriptor: { name: "TotTollFee" }, value: "0" },
                { descriptor: { name: "concessionAmount" }, value: "0" },
                { descriptor: { name: "roundOfFee" }, value: "0" },
              ],
            },
          ],
        },
      },
    ],
    ttl: "PT10M",
  };
}

function transformFulfillments(fulfillments: any[], ticketTags: any[]) {
  return fulfillments.map((f) => {
    if (f.type === "TRIP") {
      const { tags, ...rest } = f;
      return rest;
    } else if (f.type === "TICKET") {
      return {
        ...f,
        tags: [ticketTags],
      };
    }
    return f;
  });
}
