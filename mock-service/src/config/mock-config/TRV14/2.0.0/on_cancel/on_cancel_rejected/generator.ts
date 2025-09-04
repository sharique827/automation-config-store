export async function onCancelSoftUserCancellationGenerator(existingPayload: any, sessionData: any) {
  delete existingPayload.message
  existingPayload.error = {
        "code": "{ERROR_CODE}",
        "message": "Cancellation is not allowed by seller app."
}
  return existingPayload
  ;
} 