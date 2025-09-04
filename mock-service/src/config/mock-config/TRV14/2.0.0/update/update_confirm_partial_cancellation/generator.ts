/**
 * Update Confirm Partial Cancellation Generator for TRV14
 * 
 * Logic:
 * 1. Confirms the partial cancellation (reduces quantity by 1)
 * 2. Sets update_target to the item being partially cancelled
 * 3. Adds CONFIRM_CANCEL reason
 * 4. Preserves add-ons with reduced quantity
 */

export async function updateConfirmPartialCancellationGenerator(existingPayload: any, sessionData: any) {
  // Get the selected item from session (stored during select)
  const selectedItem = sessionData.selected_items?.[0];
  
  if (!selectedItem) {
    throw new Error("No selected item found in session for partial cancellation");
  }

  // Set the update target - using the item index
  existingPayload.message.update_target = "order.items[0]";
  
  // Set cancellation reason
  existingPayload.message.order = {
    cancellation: {
      reason: {
        id: "0",
        descriptor: {
          code: "CONFIRM_CANCEL"
        }
      }
    },
    items: [
      {
        id: selectedItem.id,
        quantity: {
          selected: {
            count: 1  // Reduce from 2 to 1
          }
        }
      }
    ]
  };

  // If the item has add-ons, reduce their quantity too
  if (selectedItem.add_ons && selectedItem.add_ons.length > 0) {
    existingPayload.message.order.items[0].add_ons = selectedItem.add_ons.map((addOn: any) => ({
      id: addOn.id,
      quantity: {
        selected: {
          count: 1  // Reduce from 2 to 1
        }
      }
    }));
  }

  return existingPayload;
}