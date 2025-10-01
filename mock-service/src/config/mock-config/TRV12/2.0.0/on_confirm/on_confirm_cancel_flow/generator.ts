export async function onConfirmGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.context.location.city.code =
    sessionData.user_inputs.city_code;

  return existingPayload;
}
