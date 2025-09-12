/**
 * On Select Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load quote data from session data
 */

export async function onSelectDefaultGenerator(existingPayload: any, sessionData: any) {
  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Update message_id from session data
  if (sessionData.message_id && existingPayload.context) {
    existingPayload.context.message_id = sessionData.message_id;
  }
  
  // Load quote from session data
  if (sessionData.quote && existingPayload.message) {
    existingPayload.message.quote = sessionData.quote;
  }
  
  return existingPayload;
} 