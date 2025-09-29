/**
 * Status Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load quote data from session data
 */

export async function onStatusUpdateReceiverInfoDefaultGenerator(existingPayload: any, sessionData: any) {
    // Update context timestamp
    if (existingPayload.context) {
      existingPayload.context.timestamp = new Date().toISOString();
    }
    
    console.log("existingPayload on status update receiver info", existingPayload);
    console.log("sessionData for on_status_update_receiver_info", sessionData);
    // Update transaction_id from session data
    if (sessionData.transaction_id && existingPayload.context) {
      existingPayload.context.transaction_id = sessionData.transaction_id;
    }
    
    // Update message_id from session data
    if (sessionData.message_id && existingPayload.context) {
      existingPayload.context.message_id = sessionData.message_id;
    }
    
  // Load order data from session with proper mapping to preserve default data
  if (sessionData.order && existingPayload.message) {
    const sessionOrder = sessionData.order;
    const defaultOrder = existingPayload.message.order || {};
    
    // Merge order data, preserving default values
    existingPayload.message.order = {
      ...defaultOrder,
      ...sessionOrder,
      
      // Handle items with tags preservation
      items: sessionOrder.items ? sessionOrder.items.map((sessionItem: any, index: number) => {
        // Try to find matching item by ID first
        let defaultItem = defaultOrder.items?.find((item: any) => item.id === sessionItem.id);
        
        // If no match by ID, use the item at the same index
        if (!defaultItem && defaultOrder.items?.[index]) {
          defaultItem = defaultOrder.items[index];
        }
        
        // If still no default item, use the first one as fallback
        if (!defaultItem && defaultOrder.items?.[0]) {
          defaultItem = defaultOrder.items[0];
        }
        
        return {
          ...sessionItem,
          // Preserve tags from default.yaml if available
          ...(defaultItem && defaultItem.tags && { tags: defaultItem.tags })
        };
      }) : defaultOrder.items,
      
      // Handle fulfillments with stops preservation
      fulfillments: sessionOrder.fulfillments ? sessionOrder.fulfillments.map((sessionFulfillment: any, index: number) => {
        // Try to find matching fulfillment by ID first
        let defaultFulfillment = defaultOrder.fulfillments?.find((f: any) => f.id === sessionFulfillment.id);
        
        // If no match by ID, use the fulfillment at the same index
        if (!defaultFulfillment && defaultOrder.fulfillments?.[index]) {
          defaultFulfillment = defaultOrder.fulfillments[index];
        }
        
        // If still no default fulfillment, use the first one as fallback
        if (!defaultFulfillment && defaultOrder.fulfillments?.[0]) {
          defaultFulfillment = defaultOrder.fulfillments[0];
        }
        
        return {
          id: sessionFulfillment.id,
          type: sessionFulfillment.type,
          state: sessionFulfillment.state,
          // Preserve stops from default.yaml if available
          ...(defaultFulfillment && defaultFulfillment.stops && { stops: defaultFulfillment.stops })
        };
      }) : defaultOrder.fulfillments,
      
      // Handle billing with required fields preservation
      billing: sessionOrder.billing ? {
        ...defaultOrder.billing,
        ...sessionOrder.billing
      } : defaultOrder.billing,
      
      // Handle provider
      provider: sessionOrder.provider || defaultOrder.provider,
      
      // Handle quote with correct structure preservation
      quote: sessionOrder.quote ? {
        ...defaultOrder.quote,
        ...sessionOrder.quote
      } : defaultOrder.quote,
      
      // Handle other order fields
      ...(sessionOrder.offers && { offers: sessionOrder.offers }),
      ...(sessionOrder.payments && { payments: sessionOrder.payments }),
      ...(sessionOrder.tags && { tags: sessionOrder.tags }),
      ...(sessionOrder.created_at && { created_at: sessionOrder.created_at }),
      ...(sessionOrder.updated_at && { updated_at: sessionOrder.updated_at })
    };
  }
    
    return existingPayload;
  } 