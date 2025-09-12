/**
 * On Update Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load order data from session data
 */

export async function onUpdateUnsolicitedDefaultGenerator(existingPayload: any, sessionData: any) {
  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Load order from session data
  if (sessionData.order && existingPayload.message) {
    existingPayload.message.order = sessionData.order;
  }
  
  return existingPayload;
}
