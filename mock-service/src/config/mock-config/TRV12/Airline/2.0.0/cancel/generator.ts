export async function cancelDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.message.order_id = sessionData?.confirm_order_id ?? "O1";
  return existingPayload;
}
