/**
 * On Select Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load quote data from session data
 * 4. Create fulfillments based on number of items from select payload
 */

export async function onSelectDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("On Select generator - Available session data:", {
    selected_items: !!sessionData.selected_items,
    items: !!sessionData.items,
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
  
  // Update message_id from session data
  if (sessionData.message_id && existingPayload.context) {
    existingPayload.context.message_id = sessionData.message_id;
  }
  
  // Load quote from session data
  if (sessionData.quote && existingPayload.message) {
    existingPayload.message.quote = sessionData.quote;
  }
  
  // Create fulfillments based on number of items from select payload
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    let fulfillmentType = "BAP"; // Default for most flows
    
    // Determine fulfillment type based on flow
    if (flowId === "Seller_App_Fulfilling") {
      fulfillmentType = "BPP_ONLINE_EMAIL_SMS";
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      fulfillmentType = "BAP";
    } else if (flowId === "Physical_Store_Based_Gift_Cards") {
      fulfillmentType = "BAP";
    }
    
    // Get number of items from select payload (default to 3 if not available)
    const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
    
    // Create fulfillments based on item count
    const fulfillments = [];
    for (let i = 1; i <= itemCount; i++) {
      fulfillments.push({
        id: `F${i}`,
        type: fulfillmentType
      });
    }
    
    existingPayload.message.order.fulfillments = fulfillments;
    console.log(`Created ${fulfillments.length} fulfillments with type: ${fulfillmentType}`);
  }
  
  return existingPayload;
} 