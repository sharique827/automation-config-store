import { SessionData } from "../../../session-types";

const tags = [
  {
    descriptor: { code: "VEHICLE_GRID" },
    display: false,
    list: [
      { descriptor: { code: "X_MAX" }, value: "14" },
      { descriptor: { code: "Y_MAX" }, value: "3" },
      { descriptor: { code: "Z_MAX" }, value: "1" },
      { descriptor: { code: "X_LOBBY_START" }, value: "0" },
      { descriptor: { code: "X_LOBBY_SIZE" }, value: "12" },
      { descriptor: { code: "Y_LOBBY_START" }, value: "1" },
      { descriptor: { code: "Y_LOBBY_SIZE" }, value: "1" },
      { descriptor: { code: "SEAT_SELECTION" }, value: "mandatory" },
    ],
  },
  {
    descriptor: { code: "VEHICLE_AVAIBALITY" },
    display: false,
    list: [{ descriptor: { code: "AVALIABLE_SEATS" }, value: "22" }],
  },
  {
    descriptor: { code: "VEHICLE_AMENITIES" },
    list: [{ value: "WIFI" }, { value: "BLANKET" }, { value: "CCTV" }],
  },
];

export async function onSearchGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const payload = { ...existingPayload };

  if (sessionData?.city_code) {
    payload.context.location.city.code = sessionData.city_code;
  }
  for (const provider of payload.message?.catalog?.providers ?? []) {
    provider.fulfillments = sessionData.fulfillments;
    let count = 1;
    for (const fulfillment of provider.fulfillments ?? []) {
      fulfillment.rateable = true;
      fulfillment.rating = "4.5";

      for (const stop of fulfillment.stops ?? []) {
        stop.id = `S${count}`;
        if (stop.type === "PICKUP") {
          stop.time = {
            label: "DATE_TIME",
            timestamp: new Date().toISOString(),
          };
        }
        if (stop.type === "DROP") {
          stop.time = {
            label: "DATE_TIME",
            timestamp: new Date().toISOString(),
          };
        }
        count++;
      }
      fulfillment.tags = tags;
    }
  }

  return existingPayload;
}
