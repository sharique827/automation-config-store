/**
 * On Confirm Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp and correct action
 * 2. Update transaction_id and message_id from session data
 * 3. Handle different fulfillment types, authorization, and provider structures based on flow context
 * 4. Map fulfillments, items, and provider from previous flow
 * 5. Add order status and state information
 */

import { v4 as uuidv4 } from "uuid";

export async function onConfirmDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("On Confirm generator - Available session data:", {
    order: !!sessionData.order,
    flow_id: sessionData.flow_id,
    confirm_fulfillments: !!sessionData.confirm_fulfillments,
    confirm_items: !!sessionData.confirm_items
  });

  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Preserve the message_id from the confirm request
  if (existingPayload.context) {
    console.log("Using message_id from confirm request context:", existingPayload.context.message_id);
  }
  
  // Handle order structure based on flow context
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    
    // Get fulfillments and items from confirm request (stored in session data)
    let confirmFulfillments = sessionData.confirm_fulfillments || [];
    let confirmItems = sessionData.confirm_items || [];
    
    // Fallback: if confirm data is not available, create default ones based on flow
    if (confirmFulfillments.length === 0) {
      console.log("No confirm fulfillments found, creating default fulfillments based on flow");
      const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
      
      if (flowId === "Physical_Store_Based_Gift_Cards") {
        confirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else if (flowId === "Seller_App_Fulfilling") {
        confirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BPP_ONLINE_EMAIL_SMS"
        }));
      } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
        confirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else {
        // Default fallback
        confirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      }
    }
    
    if (confirmItems.length === 0) {
      confirmItems = sessionData.selected_items || [{ id: "GC1" }];
    }
    
    const fulfillmentIds = confirmFulfillments.map((f: any) => f.id);
    
    console.log("On Confirm - Flow:", flowId, "Fulfillments:", confirmFulfillments.length, "Items:", confirmItems.length);
    
    // Add order status and ID
    existingPayload.message.order.id = "O1";
    
    // Set status based on flow
    if (flowId === "Update_Receiver_Info") {
      existingPayload.message.order.status = "ACCEPTED";
    } else {
      existingPayload.message.order.status = "ACCEPTED";
    }
    
    if (flowId === "Physical_Store_Based_Gift_Cards") {
      // Physical Store Gift Cards - BAP fulfillments with authorization and location
      existingPayload.message.order.provider = {
        id: "P1",
        locations: [
          {
            id: "L1",
            gps: "28.524596, 77.185577",
            descriptor: {
              name: "Croma E-Gift",
              short_desc: "Croma E-Gift Cards (Instant Vouchers)",
              images: [
                {
                  url: "https://sellerapp.com/ondc/images/location.png",
                  size_type: "md"
                }
              ]
            },
            address: "Croma - Odeon CP, Ground Floor, Odeon Cine Complex,Cannaught Place"
          }
        ]
      };
      
      existingPayload.message.order.fulfillments = confirmFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        state: {
          descriptor: { code: "COMPLETED" }
        },
        type: "BAP",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` },
            authorization: {
              type: "CODE",
              token: "12383235623423467"
            },
            location: { gps: "28.524596, 77.185577" }
          }
        ]
      }));
      
      existingPayload.message.order.items = confirmItems.map((item: any) => ({
        ...item,
        price: {
          currency: "INR",
          value: "1500",
          offered_value: "1500"
        },
        location_ids: ["L1"],
        fulfillment_ids: fulfillmentIds
      }));
      
      console.log("Applied Physical_Store_Based_Gift_Cards: BAP fulfillments with authorization + location + provider locations");
      
    } else if (flowId === "Seller_App_Fulfilling") {
      // Seller App Fulfilling - BPP_ONLINE_EMAIL_SMS fulfillments without authorization
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = confirmFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        state: {
          descriptor: { code: "COMPLETED" }
        },
        type: "BPP_ONLINE_EMAIL_SMS",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` }
            // No authorization for seller app fulfilling
          }
        ]
      }));
      
      existingPayload.message.order.items = confirmItems.map((item: any) => ({
        ...item,
        price: {
          currency: "INR",
          value: "1500",
          offered_value: "1500"
        },
        // No location_ids for electronic delivery
        fulfillment_ids: fulfillmentIds
      }));
      
      console.log("Applied Seller_App_Fulfilling: BPP_ONLINE_EMAIL_SMS fulfillments without authorization");
      
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm") {
      // Buyer App Fulfilling (on_confirm with codes) - BAP fulfillments with authorization
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = confirmFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        state: {
          descriptor: { code: "COMPLETED" }
        },
        type: "BAP",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` },
            authorization: {
              type: "CODE",
              token: "12383235623423467"
            }
          }
        ]
      }));
      
      existingPayload.message.order.items = confirmItems.map((item: any) => ({
        ...item,
        price: {
          currency: "INR",
          value: "1500",
          offered_value: "1500"
        },
        // No location_ids for electronic delivery
        fulfillment_ids: fulfillmentIds
      }));
      
      console.log("Applied Buyer_App_Fulfilling_Code_On_Confirm: BAP fulfillments with authorization");
      
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      // Buyer App Fulfilling (on_update without codes) - BAP fulfillments without authorization
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = confirmFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        state: {
          descriptor: { code: "COMPLETED" }
        },
        type: "BAP",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` }
            // No authorization for on_update
          }
        ]
      }));
      
      existingPayload.message.order.items = confirmItems.map((item: any) => ({
        ...item,
        price: {
          currency: "INR",
          value: "1500",
          offered_value: "1500"
        },
        // No location_ids for electronic delivery
        fulfillment_ids: fulfillmentIds
      }));
      
      console.log("Applied Buyer_App_Fulfilling_Code_On_Update: BAP fulfillments without authorization");
      
    } else {
      // Default fallback - use session data
  if (sessionData.order && existingPayload.message) {
    existingPayload.message.order = sessionData.order;
      }
      console.log("Using default/session data for on_confirm order structure");
    }
  }
  
  return existingPayload;
}
