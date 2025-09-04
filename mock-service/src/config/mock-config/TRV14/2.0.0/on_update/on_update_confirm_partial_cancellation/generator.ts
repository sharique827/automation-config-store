/**
 * On_Update Confirm Partial Cancellation Generator for TRV14
 * 
 * Logic:
 * 1. Returns order with ACTIVE status (cancellation confirmed)
 * 2. Updates item quantity from 2 to 1
 * 3. Adds REFUND entry in quote breakup for cancelled quantity
 * 4. Recalculates total price
 */

export async function onUpdateConfirmPartialCancellationGenerator(existingPayload: any, sessionData: any) {
  // Load order details from session
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  
  // Set order status to ACTIVE (confirmed partial cancellation)
  existingPayload.message.order.status = "ACTIVE";
  
  // Load items from session with updated quantities
  if (sessionData.items) {
    const items = [...sessionData.items];
    
    // Find and update the cancelled item quantity
    const selectedItem = sessionData.selected_items?.[0];
    if (selectedItem) {
      const itemIndex = items.findIndex((item: any) => item.id === selectedItem.id);
      if (itemIndex !== -1) {
        // Update quantity to 1 (reduced from 2)
        items[itemIndex] = {
          ...items[itemIndex],
          quantity: {
            ...items[itemIndex].quantity,
            selected: {
              count: 1
            }
          }
        };
        
        // Update add-ons quantity if present
        if (items[itemIndex].add_ons) {
          items[itemIndex].add_ons = items[itemIndex].add_ons.map((addOn: any) => ({
            ...addOn,
            quantity: {
              ...addOn.quantity,
              selected: {
                count: 1
              }
            }
          }));
        }
      }
    }
    
    existingPayload.message.order.items = items;
  }
  
  // Load fulfillments from session
  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
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
  
  // Load tags from session
  if (sessionData.tags) {
    existingPayload.message.order.tags = [sessionData.tags];
  }
  
  // Load cancellation_terms from session
  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms;
  }
  
  // Load replacement_terms from session
  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms;
  }
  
  // Calculate updated quote with refund
  const selectedItem = sessionData.selected_items?.[0];
  if (sessionData.quote && selectedItem) {
    const breakup = [...sessionData.quote.breakup];
    
    // Calculate refund amount for 1 cancelled item
    const itemPrice = parseFloat(selectedItem.price?.value || "0");
    let refundAmount = itemPrice;
    
    // Add refund for add-ons if present
    if (selectedItem.add_ons) {
      selectedItem.add_ons.forEach((addOn: any) => {
        const addOnPrice = parseFloat(addOn.price?.value || "0");
        refundAmount += addOnPrice;
      });
    }
    
    // Add REFUND entry to breakup
    breakup.push({
      title: "REFUND",
      item: {
        id: selectedItem.id,
        price: {
          currency: selectedItem.price?.currency || "INR",
          value: `-${itemPrice}`
        },
        quantity: {
          selected: {
            count: 1  // Quantity being refunded
          }
        },
        ...(selectedItem.add_ons && {
          add_ons: selectedItem.add_ons.map((addOn: any) => ({
            id: addOn.id,
            price: {
              currency: addOn.price?.currency || "INR",
              value: addOn.price?.value
            }
          }))
        })
      },
      price: {
        currency: selectedItem.price?.currency || "INR",
        value: `-${refundAmount}`
      }
    });
    
    // Add cancellation charges (0 for confirmed cancel)
    breakup.push({
      title: "CANCELLATION_CHARGES",
      price: {
        currency: "INR",
        value: "0"
      }
    });
    
    // Recalculate total price
    const originalTotal = parseFloat(sessionData.quote.price.value);
    const newTotal = originalTotal - refundAmount;
    
    existingPayload.message.order.quote = {
      breakup,
      price: {
        currency: sessionData.quote.price.currency || "INR",
        value: newTotal.toString()
      }
    };
  }
  
  // Add timestamps
  if (sessionData.created_at) {
    existingPayload.message.order.created_at = sessionData.created_at;
  }
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  
  return existingPayload;
}