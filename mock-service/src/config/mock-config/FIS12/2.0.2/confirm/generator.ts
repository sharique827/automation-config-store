/**
 * Confirm Generator for FIS10
 * 
 * Logic:
 * 1. Load fields from session: items, fulfillments, provider, billing, tags
 * 2. Update payments with transaction_id and amount from session
 * 3. Create quote based on items
 * 4. Payments structure comes pre-injected from default.yaml
 */

export async function confirmDefaultGenerator(existingPayload: any, sessionData: any) {

  
  // Load items from session
  if (sessionData.selected_items) {
    existingPayload.message.order.items = sessionData.selected_items;
  } else if (sessionData.item) {
    existingPayload.message.order.items = [sessionData.item];
  }
  
  // // Load fulfillments from session
  // if (sessionData.selected_fulfillments) {
  //   existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
  // }
  
  // Load provider from session
  if (sessionData.selected_provider) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  
  // Load billing from session
  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  
  // Load tags from session (BAP_TERMS and BPP_TERMS)
  if (sessionData.tags) {
    existingPayload.message.order.tags = sessionData.tags;
  }
  
  // Create quote based on items
  if (existingPayload.message.order.items && Array.isArray(existingPayload.message.order.items)) {
    let totalValue = 0;
    
    existingPayload.message.order.items.forEach((item: any) => {
      if (item.price && item.price.value) {
        const itemValue = parseFloat(item.price.value);
        const quantity = item.quantity?.selected?.count || 1;
        totalValue += itemValue * quantity;
      }
    });
    
    existingPayload.message.order.quote = {
      price: {
        currency: "INR",
        value: totalValue.toString()
      },
      breakup: existingPayload.message.order.items.map((item: any) => ({
        title: item.descriptor?.name || item.id,
        price: {
          currency: "INR",
          value: item.price?.value || "0"
        },
        item: {
          id: item.id,
          quantity: item.quantity
        }
      }))
    };
    
    console.log("Created quote with total value:", totalValue);
  }
  
  // Update payments with transaction_id and amount from session
  if (existingPayload.message.order.payments && Array.isArray(existingPayload.message.order.payments)) {
    existingPayload.message.order.payments.forEach((payment: any) => {
      if (payment.params) {
        // Update transaction_id from session
        if (sessionData.transaction_id) {
          payment.params.transaction_id = sessionData.transaction_id;
        }
        // Optionally mirror payable amount
        if (existingPayload.message.order.quote?.price?.value) {
          payment.params.amount = existingPayload.message.order.quote.price.value;
          payment.params.currency = existingPayload.message.order.quote.price.currency || 'INR';
        }
      }
    });
  }
  
  return existingPayload;
}
