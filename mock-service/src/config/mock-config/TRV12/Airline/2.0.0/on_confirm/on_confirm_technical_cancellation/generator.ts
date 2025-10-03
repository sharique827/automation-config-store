export async function onConfirmTechnicalCancellationGenerator(existingPayload: any, sessionData: any) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  return existingPayload;} 