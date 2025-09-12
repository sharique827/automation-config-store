/**
 * Select Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load provider, items, fulfillments, and payments from session data
 */

export async function selectDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("Select generator - Available session data:", {
    selected_provider: !!sessionData.selected_provider,
    selected_items: !!sessionData.selected_items,
    selected_fulfillments: !!sessionData.selected_fulfillments,
    items: !!sessionData.items,
    fulfillments: !!sessionData.fulfillments
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
  
  // Load provider from session data
  if (sessionData.selected_provider && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.provider = sessionData.selected_provider;
    console.log("Loaded selected_provider to order");
  }
  
  // Load items from catalog data (from on_search)
  if (sessionData.items && existingPayload.message && existingPayload.message.order) {
    // Take first 2 items as selected items
    const selectedItems = sessionData.items.slice(0, 2).map((item: any) => ({
      ...item,
      quantity: {
        selected: {
          count: 1
        }
      }
    }));
    existingPayload.message.order.items = selectedItems;
    console.log("Loaded items from catalog data:", selectedItems.length, "items");
  }
  
  // Load fulfillments from catalog data (from on_search)
  if (sessionData.fulfillments && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    console.log("Loaded fulfillments from catalog data:", sessionData.fulfillments.length, "fulfillments");
  }
  
  
  return existingPayload;
} 