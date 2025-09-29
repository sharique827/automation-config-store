/**
 * On Cancel Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Handle different fulfillment types and item configurations based on flow context
 * 4. Map fulfillments, items, and provider from previous flow
 * 5. Set cancellation status and zero out quote values
 */

import { v4 as uuidv4 } from "uuid";

export async function onCancelDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("On Cancel generator - Available session data:", {
    order: !!sessionData.order,
    flow_id: sessionData.flow_id,
    on_confirm_fulfillments: !!sessionData.on_confirm_fulfillments,
    on_confirm_items: !!sessionData.on_confirm_items
  });

  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Generate new unique message_id for on_cancel
  if (existingPayload.context) {
    existingPayload.context.message_id = uuidv4();
    console.log("Generated new message_id for on_cancel:", existingPayload.context.message_id);
  }
  
  // Handle order structure based on flow context
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    
    // Get fulfillments and items from on_confirm response (stored in session data)
    let onConfirmFulfillments = sessionData.on_confirm_fulfillments || [];
    let onConfirmItems = sessionData.on_confirm_items || [];
    
    // Fallback: if on_confirm data is not available, create default ones based on flow
    if (onConfirmFulfillments.length === 0) {
      console.log("No on_confirm fulfillments found, creating default fulfillments based on flow");
      const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
      
      if (flowId === "Physical_Store_Based_Gift_Cards") {
        onConfirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP",
          stops: [
            {
              contact: { phone: `999988886${7 + i}`, email: `receiver${i + 1}@test.com` },
              person: { name: `Receiver Name ${i + 1}` },
              authorization: { type: "CODE", token: "12383235623423467" },
              location: { gps: "28.524596, 77.185577" }
            }
          ]
        }));
      } else if (flowId === "Seller_App_Fulfilling") {
        onConfirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BPP_ONLINE_EMAIL_SMS",
          stops: [
            {
              contact: { phone: `999988886${7 + i}`, email: `receiver${i + 1}@test.com` },
              person: { name: `Receiver Name ${i + 1}` }
            }
          ]
        }));
      } else {
        // Buyer App Fulfilling flows
        onConfirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP",
          stops: [
            {
              contact: { phone: `999988886${7 + i}`, email: `receiver${i + 1}@test.com` },
              person: { name: `Receiver Name ${i + 1}` },
              authorization: { type: "CODE", token: "12383235623423467" }
            }
          ]
        }));
      }
    }
    
    // Fallback: if on_confirm items is not available, create default ones
    if (onConfirmItems.length === 0) {
      console.log("No on_confirm items found, creating default items based on flow");
      const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
      onConfirmItems = Array.from({ length: itemCount }, (_, i) => ({
        id: `GC${i + 1}`,
        quantity: { selected: { count: 3 } },
        tags: [
          {
            descriptor: { code: "CUSTOMIZATION" },
            list: [
              { descriptor: { code: "RECEIVER_NAME" }, value: "Test Name" },
              { descriptor: { code: "MESSAGE" }, value: "Happy Birthday to you!!" }
            ]
          }
        ]
      }));
    }
    
    const fulfillmentIds = onConfirmFulfillments.map((f: any) => f.id);
    
    console.log("On Cancel - Flow:", flowId, "Fulfillments:", onConfirmFulfillments.length, "Items:", onConfirmItems.length);
    
    // Set order status to CANCELLED and add cancellation details
    existingPayload.message.order.status = "CANCELLED";
    existingPayload.message.order.cancellation = {
      cancelled_by: "PROVIDER",
      reason: { id: "001" }
    };
    
    // Ensure order ID matches the previous flow
    const orderId = sessionData.on_confirm_order_id || sessionData.order_id || "O1";
    existingPayload.message.order.id = orderId;
    
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
      
      existingPayload.message.order.fulfillments = onConfirmFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        state: {
          descriptor: { code: "CANCELLED" }
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
      
      existingPayload.message.order.items = onConfirmItems.map((item: any) => ({
        ...item,
        price: {
          currency: "INR",
          value: "1500",
          offered_value: "1500"
        },
        location_ids: ["L1"],
        fulfillment_ids: fulfillmentIds
      }));
      
      console.log("Applied Physical_Store_Based_Gift_Cards: BAP fulfillments with CANCELLED state + authorization + location + provider locations");
      
    } else if (flowId === "Seller_App_Fulfilling") {
      // Seller App Fulfilling - BPP_ONLINE_EMAIL_SMS fulfillments without authorization
      existingPayload.message.order.provider = {
        id: "P1"
      };
      
      existingPayload.message.order.fulfillments = onConfirmFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        state: {
          descriptor: { code: "CANCELLED" }
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
      
      existingPayload.message.order.items = onConfirmItems.map((item: any) => ({
        ...item,
        price: {
          currency: "INR",
          value: "1500",
          offered_value: "1500"
        },
        // No location_ids for electronic delivery
        fulfillment_ids: fulfillmentIds
      }));
      
      console.log("Applied Seller_App_Fulfilling: BPP_ONLINE_EMAIL_SMS fulfillments with CANCELLED state without authorization");
      
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      // Buyer App Fulfilling - BAP fulfillments with authorization
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = onConfirmFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        state: {
          descriptor: { code: "CANCELLED" }
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
      
      existingPayload.message.order.items = onConfirmItems.map((item: any) => ({
        ...item,
        price: {
          currency: "INR",
          value: "1500",
          offered_value: "1500"
        },
        // No location_ids for electronic delivery
        fulfillment_ids: fulfillmentIds
      }));
      
      console.log("Applied Buyer_App_Fulfilling: BAP fulfillments with CANCELLED state and authorization");
      
    } else {
      // Default fallback - use session data with proper mapping
      if (sessionData.order && existingPayload.message) {
        const sessionOrder = sessionData.order;
        const defaultOrder = existingPayload.message.order;
        
        existingPayload.message.order = {
          ...defaultOrder,
          ...sessionOrder,
          status: "CANCELLED",
          cancellation: {
            cancelled_by: "PROVIDER",
            reason: { id: "001" }
          },
          id: orderId,
          
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
              ...defaultItem,
              ...sessionItem,
              price: {
                currency: "INR",
                value: "1500",
                offered_value: "1500"
              }
            };
          }) : defaultOrder.items,
          
          // Handle fulfillments with CANCELLED state
          fulfillments: sessionOrder.fulfillments ? sessionOrder.fulfillments.map((fulfillment: any) => ({
            ...fulfillment,
            state: {
              descriptor: { code: "CANCELLED" }
            }
          })) : defaultOrder.fulfillments
        };
        
        console.log("Applied default fallback with CANCELLED status and proper mapping");
      }
    }
    
    // Set quote values to zero for cancelled orders
    if (existingPayload.message.order.quote) {
      existingPayload.message.order.quote.price.value = "0";
      if (existingPayload.message.order.quote.breakup) {
        existingPayload.message.order.quote.breakup.forEach((breakup: any) => {
          if (breakup.price && breakup.price.value) {
            breakup.price.value = "0";
          }
        });
      }
    }
    
    // Set payments status to PAID for cancelled orders
    if (existingPayload.message.order.payments) {
      existingPayload.message.order.payments.forEach((payment: any) => {
        payment.status = "PAID";
      });
    }
  }
  
  return existingPayload;
}
