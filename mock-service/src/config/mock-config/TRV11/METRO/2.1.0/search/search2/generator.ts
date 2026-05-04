import { SessionData } from "../../../../session-types";

function getRandomStations(data: any) {
  // Flatten all stops across all fulfillments
  const allStops = data.flatMap((fulfillment: any) => fulfillment.stops);

  // Get two unique random indices
  let firstIndex = Math.floor(Math.random() * allStops.length);
  let secondIndex: number;

  do {
    secondIndex = Math.floor(Math.random() * allStops.length);
  } while (secondIndex === firstIndex); // Ensure the indices are different

  // Return the randomly selected stops
  return {
    start_station: allStops[firstIndex].location.descriptor.code,
    end_station: allStops[secondIndex].location.descriptor.code,
  };
}

export async function search2Generator(
  existingPayload: any,
  sessionData: SessionData,
) {
  const rawData = sessionData.user_inputs;
  const user_input =
    typeof rawData === "string" ? JSON.parse(rawData) : rawData;
  existingPayload.context.bpp_id = user_input?.bpp_id ?? "xyz.com";
  existingPayload.context.bpp_uri = sessionData?.subscriber_url
  existingPayload.context.location.city.code =
    user_input?.city_code ?? "std:011";
  existingPayload.message.intent.fulfillment = {
    stops: [
      {
        type: "START",
        location: {
          descriptor: {
            code: user_input?.start_stop_code ?? "SHAHEED_STHAL",
          },
        },
      },
      {
        type: "END",
        location: {
          descriptor: {
            code: user_input?.end_stop_code ?? "AZADPUR",
          },
        },
      },
    ],
    vehicle: {
      category: user_input?.vehicle_category ?? "METRO",
    },
  };

  existingPayload.message.intent.payment.collected_by =
    user_input?.collector ?? "BPP";
  // delete existingPayload.context.bpp_id
  // delete existingPayload.context.bpp_uri
  // Preserve the stops as they are - do not modify the codes
  // The codes (e.g., MOCK_STATION_1, MOCK_STATION_15) will be saved via save-data.yaml
  return existingPayload;
}
