export async function cancelConfirmUserCancellationGenerator(existingPayload: any, sessionData: any) {
if(sessionData.order_id){
  existingPayload.message.order_id = sessionData.order_id;
}
existingPayload.message.cancellation_reason_id = sessionData.cancellation_reason_id

return existingPayload;} 