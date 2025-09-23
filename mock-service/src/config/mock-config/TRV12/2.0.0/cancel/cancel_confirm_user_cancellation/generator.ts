export async function cancelConfirmUserCancellationGenerator(existingPayload: any, sessionData: any) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  return existingPayload;} 