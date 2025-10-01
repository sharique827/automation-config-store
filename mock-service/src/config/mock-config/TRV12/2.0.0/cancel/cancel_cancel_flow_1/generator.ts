export async function cancelGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.location.city.code = sessionData.city_code;
  existingPayload.message.order_id = sessionData.order_id;

  return existingPayload;
}
