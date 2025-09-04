export async function onCancelConfirmUserCancellationGenerator(existingPayload: any, sessionData: any) {
  if(sessionData.order){
    existingPayload.message.order = sessionData.order;
  }

  existingPayload.message.order.status = "CANCELLED";
    if(sessionData.cancellation_reason_id){
    existingPayload.message.order.cancellation = {
      "cancelled_by": "CONSUMER",
      "reason": {
        "descriptor": {
          "code": sessionData.cancellation_reason_id
        }
      }
    }
  }

  return existingPayload;} 