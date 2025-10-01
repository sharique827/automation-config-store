export async function initGenerator(existingPayload: any, sessionData: any) {
  if (existingPayload.message) {
    existingPayload.error = existingPayload.message.error;
  }
  const { error, context } = existingPayload;
  return { error, context };
}
