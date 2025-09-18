export async function statusGenerator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }

  console.log("sessionData for status", sessionData);
  
  // Update order ID from session data if available
  // The status YAML has a simple structure with just order_id
  if (sessionData.order_id) {
    existingPayload.message = existingPayload.message || {};
    existingPayload.message.order_id = sessionData.order_id;
  }

  return existingPayload;
}
