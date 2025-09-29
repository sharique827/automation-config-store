/**
 * On Status Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load order data from session data with proper mapping
 */

import { v4 as uuidv4 } from "uuid";

export async function onStatusDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("On Status generator - Available session data:", {
    order: !!sessionData.order,
    order_id: sessionData.order_id,
    on_confirm_order_id: sessionData.on_confirm_order_id,
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
  
  // Generate new unique message_id for on_status
  if (existingPayload.context) {
    existingPayload.context.message_id = uuidv4();
    console.log("Generated new message_id for on_status:", existingPayload.context.message_id);
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
          type: "BAP"
        }));
      } else if (flowId === "Seller_App_Fulfilling") {
        onConfirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BPP_ONLINE_EMAIL_SMS"
        }));
      } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
        onConfirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else {
        // Default fallback
        onConfirmFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      }
    }
    
    if (onConfirmItems.length === 0) {
      onConfirmItems = sessionData.selected_items || [{ id: "GC1" }];
    }
    
    const fulfillmentIds = onConfirmFulfillments.map((f: any) => f.id);
    
    // Ensure order ID matches the status request order_id
    const orderId = sessionData.on_confirm_order_id || sessionData.order_id || "O1";
    
    console.log("On Status - Flow:", flowId, "Fulfillments:", onConfirmFulfillments.length, "Items:", onConfirmItems.length);
    
    if (flowId === "Physical_Store_Based_Gift_Cards") {
      // Physical Store Gift Cards - BAP fulfillments with authorization and location
      existingPayload.message.order.id = orderId;
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
      
      console.log("Applied Physical_Store_Based_Gift_Cards: BAP fulfillments with authorization + location + provider locations");
      
    } else if (flowId === "Seller_App_Fulfilling") {
      // Seller App Fulfilling - BPP_ONLINE_EMAIL_SMS fulfillments without authorization
      existingPayload.message.order.id = orderId;
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = onConfirmFulfillments.map((fulfillment: any, index: number) => ({
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
      
      console.log("Applied Seller_App_Fulfilling: BPP_ONLINE_EMAIL_SMS fulfillments without authorization");
      
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      // Buyer App Fulfilling - BAP fulfillments with authorization
      existingPayload.message.order.id = orderId;
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = onConfirmFulfillments.map((fulfillment: any, index: number) => ({
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
      
      console.log("Applied Buyer_App_Fulfilling: BAP fulfillments with authorization");
      
    } else {
      // Default fallback - use session data with proper mapping
  if (sessionData.order && existingPayload.message) {
    const sessionOrder = sessionData.order;
    const defaultOrder = existingPayload.message.order || {};
        
        // Ensure order ID matches the status request order_id
        const orderId = sessionData.on_confirm_order_id || sessionData.order_id || "O1";
    
    // Merge order data, preserving default values
    existingPayload.message.order = {
      ...defaultOrder,
      ...sessionOrder,
          id: orderId, // Ensure order ID matches status request
      
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
          state: sessionFulfillment.state || {
            descriptor: { code: "COMPLETED" }
          },
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
      console.log("Using default/session data for on_status order structure");
    }
  }
  
  return existingPayload;
} 