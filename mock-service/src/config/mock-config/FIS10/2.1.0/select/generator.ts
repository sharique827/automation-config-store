/**
 * Select Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load provider, items, fulfillments, and payments from session data
 * 4. Handle different fulfillment types based on flow context
 */

import { v4 as uuidv4 } from "uuid";

export async function selectDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("Select generator - Available session data:", {
    selected_provider: !!sessionData.selected_provider,
    selected_items: !!sessionData.selected_items,
    selected_fulfillments: !!sessionData.selected_fulfillments,
    items: !!sessionData.items,
    fulfillments: !!sessionData.fulfillments,
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
  
  // Generate new unique message_id for select
  if (existingPayload.context) {
    existingPayload.context.message_id = uuidv4();
    console.log("Generated new message_id for select:", existingPayload.context.message_id);
  }
  
  // Set simplified provider structure (only ID)
  if (existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.provider = {
      id: "P1"
    };
    console.log("Set simplified provider structure");
  }
  
  // Create simplified items structure with selected quantities
  if (existingPayload.message && existingPayload.message.order) {
    const selectedItems = [
      {
        id: "GC1",
        quantity: {
          selected: {
            count: 3
          }
        }
      },
      {
        id: "GC2",
        quantity: {
          selected: {
            count: 1
          }
        }
      },
      {
        id: "GC5",
        quantity: {
          selected: {
            count: 1
          }
        },
        price: {
          currency: "INR",
          offered_value: "1500"
        }
      }
    ];
    existingPayload.message.order.items = selectedItems;
    console.log("Set simplified items structure:", selectedItems.length, "items");
  }
  
  // Handle fulfillments based on flow context
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    let fulfillments = [];
    
    if (flowId === "Seller_App_Fulfilling") {
      // For Seller_App_Fulfilling flow, use BPP_ONLINE_EMAIL_SMS fulfillment
      fulfillments = [{
        type: "BPP_ONLINE_EMAIL_SMS"
      }];
      console.log("Applied Seller_App_Fulfilling fulfillment type: BPP_ONLINE_EMAIL_SMS");
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      // For Buyer_App_Fulfilling flows, use BAP fulfillment
      fulfillments = [{
        type: "BAP"
      }];
      console.log("Applied Buyer_App_Fulfilling fulfillment type: BAP");
    } else if (flowId === "Physical_Store_Based_Gift_Cards") {
      // For Physical_Store_Based_Gift_Cards flow, use BAP fulfillment with location
      fulfillments = [{
        type: "BAP",
        stops: [{
          location: {
            gps: "28.524596, 77.185577"
          }
        }]
      }];
      console.log("Applied Physical_Store_Based_Gift_Cards fulfillment type: BAP with location");
    } else {
      // Default fallback - use fulfillments from session data if available
      if (sessionData.fulfillments) {
        fulfillments = sessionData.fulfillments;
        console.log("Using fulfillments from session data:", fulfillments.length, "fulfillments");
      } else {
        // Ultimate fallback - use default fulfillment
        fulfillments = [{
          type: "BPP_ONLINE_EMAIL_SMS"
        }];
        console.log("Using default fulfillment type: BPP_ONLINE_EMAIL_SMS");
      }
    }
    
    existingPayload.message.order.fulfillments = fulfillments;
  }
  
  // Add offers to the order
  if (existingPayload.message && existingPayload.message.order) {
    const offers = [
      {
        id: "DISCA100",
        item_ids: ["GC1"]
      },
      {
        id: "FREEBIE123", 
        item_ids: ["GC2"]
      }
    ];
    existingPayload.message.order.offers = offers;
    console.log("Added offers to order:", offers.length, "offers");
  }
  
  return existingPayload;
} 