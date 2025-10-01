import { v4 as uuidv4 } from "uuid";

export async function onConfirmGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.context.location.city.code =
    sessionData.user_inputs.city_code;

  return existingPayload;
}
