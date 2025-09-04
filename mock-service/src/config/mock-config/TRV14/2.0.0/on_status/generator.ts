/**
 * On_Status Generator for TRV14
 * 
 * Logic:
 * 1. Load all fields from session (stored from on_confirm)
 * 2. Update order status: "ACTIVE" → "COMPLETED"
 * 3. Update fulfillment state: "CONFIRMED" → "COMPLETED"
 * 4. Update authorization status: "UNCLAIMED" → "CLAIMED"
 */

export async function onStatusDefaultGenerator(existingPayload: any, sessionData: any) {
  // Load order details from session
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  
  // Update order status to COMPLETED
  existingPayload.message.order.status = "COMPLETED";
  
  // Load items from session
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }
  
  // Load fulfillments from session and update state + authorization status
  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    
    // Update fulfillment state and authorization status
    if (Array.isArray(existingPayload.message.order.fulfillments)) {
      existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
        // Update fulfillment state to COMPLETED
        if (fulfillment.state) {
          fulfillment.state.descriptor.code = "COMPLETED";
        }
        
        // Update authorization status to CLAIMED
        if (Array.isArray(fulfillment.stops)) {
          fulfillment.stops.forEach((stop: any) => {
            if (stop.authorization && stop.authorization.status) {
              stop.authorization.status = "CLAIMED";
            }
          });
        }
      });
    }
  }
  
  // Load provider from session
  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }
  
  // Load billing from session
  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  
  // Load payments from session
  if (sessionData.payments) {
    existingPayload.message.order.payments = sessionData.payments;
  }
  
  // Load quote from session
  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  
  // Load cancellation_terms from session
  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms;
  }
  
  // Load replacement_terms from session
  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms;
  }
  
  // Load tags from session
  if (sessionData.tags) {
    existingPayload.message.order.tags = [sessionData.tags];
  }
  
  // Load timestamps from session
  if (sessionData.created_at) {
    existingPayload.message.order.created_at = sessionData.created_at;
  }
  
  if (sessionData.updated_at) {
    existingPayload.message.order.updated_at = sessionData.updated_at;
  }
  
  return existingPayload;
} 