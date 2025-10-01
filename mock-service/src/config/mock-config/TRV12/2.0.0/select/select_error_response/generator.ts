import { SessionData } from "../../../session-types";

export async function selectGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.context.location.city.code =
    sessionData.user_inputs?.city_code;

  return existingPayload;
}
