/**
 * Status Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load order_id from on_confirm response (stored in session data)
 */

import { v4 as uuidv4 } from "uuid";

export async function statusDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("Status generator - Available session data:", {
    order_id: sessionData.order_id,
    on_confirm_order_id: sessionData.on_confirm_order_id,
    flow_id: sessionData.flow_id
  });

  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Generate new unique message_id for status
  if (existingPayload.context) {
    existingPayload.context.message_id = uuidv4();
    console.log("Generated new message_id for status:", existingPayload.context.message_id);
  }
  
  // Load order_id from on_confirm response (should match on_confirm order.id)
  if (existingPayload.message) {
    // Priority: on_confirm_order_id > order_id > default "O1"
    const orderId = sessionData.on_confirm_order_id || sessionData.order_id || "O1";
    existingPayload.message.order_id = orderId;
    console.log("Set order_id for status request:", orderId);
  }
  
  return existingPayload;
} 