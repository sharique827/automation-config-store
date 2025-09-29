/**
 * Update Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp and correct action
 * 2. Update transaction_id and message_id from session data
 * 3. Handle update_target and fulfillment updates with UPDATE_RECEIVER_INFO tags
 * 4. Map fulfillments and items from previous flow
 */

import { v4 as uuidv4 } from "uuid";

export async function updateDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("Update generator - Available session data:", {
    order: !!sessionData.order,
    flow_id: sessionData.flow_id,
    update_target: sessionData.update_target,
    on_status_fulfillments: !!sessionData.on_status_fulfillments
  });

  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Generate new unique message_id for update
  if (existingPayload.context) {
    existingPayload.context.message_id = uuidv4();
    console.log("Generated new message_id for update:", existingPayload.context.message_id);
  }
  
  // Handle order structure based on flow context
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    
    // Always create default fulfillments based on flow to ensure proper structure
    const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
    let onStatusFulfillments = [];
    
    if (flowId === "Physical_Store_Based_Gift_Cards") {
      onStatusFulfillments = Array.from({ length: itemCount }, (_, i) => ({
        id: `F${i + 1}`,
        type: "BAP"
      }));
    } else if (flowId === "Seller_App_Fulfilling") {
      onStatusFulfillments = Array.from({ length: itemCount }, (_, i) => ({
        id: `F${i + 1}`,
        type: "BPP_ONLINE_EMAIL_SMS"
      }));
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      onStatusFulfillments = Array.from({ length: itemCount }, (_, i) => ({
        id: `F${i + 1}`,
        type: "BAP"
      }));
    } else if (flowId === "Update_Receiver_Info") {
      // Update_Receiver_Info flow - use BAP fulfillments
      onStatusFulfillments = Array.from({ length: itemCount }, (_, i) => ({
        id: `F${i + 1}`,
        type: "BAP"
      }));
    } else {
      // Default fallback
      onStatusFulfillments = Array.from({ length: itemCount }, (_, i) => ({
        id: `F${i + 1}`,
        type: "BAP"
      }));
    }
    
    console.log("Created default fulfillments based on flow:", flowId, "Count:", onStatusFulfillments.length);
    
    // Ensure order ID matches the previous flow
    const orderId = sessionData.on_confirm_order_id || sessionData.order_id || "O1";
    
    console.log("Update - Flow:", flowId, "Fulfillments:", onStatusFulfillments.length);
    console.log("Update - onStatusFulfillments:", JSON.stringify(onStatusFulfillments, null, 2));
    
    // Set update_target for fulfillment stops
    existingPayload.message.update_target = "fulfillments[0].stops";
    
    // Set order ID
    existingPayload.message.order.id = orderId;
    
    // Create update request with minimal order data focused on fulfillments
    existingPayload.message.order.fulfillments = onStatusFulfillments.map((fulfillment: any, index: number) => {
      console.log("Update - Processing fulfillment:", fulfillment.id, "Index:", index);
      const baseFulfillment = {
        id: fulfillment.id,
        stops: [
          {
            id: fulfillment.id,
            contact: { 
              phone: "9999888867", 
              email: "receiver@test.com" 
            },
            person: { 
              name: "Receiver Name 1" 
            }
          }
        ],
        tags: [
          {
            descriptor: { code: "UPDATE_RECEIVER_INFO" },
            list: [
              { descriptor: { code: "EMAIL" }, value: "updated_rec@test.com" },
              { descriptor: { code: "PHONE" }, value: "9865432190" }
            ]
          }
        ]
      };
      
      // Add authorization for flows that require it
      if (flowId === "Physical_Store_Based_Gift_Cards" || 
          flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || 
          flowId === "Buyer_App_Fulfilling_Code_On_Update") {
        (baseFulfillment.stops[0] as any).authorization = {
          type: "CODE",
          token: "12383235623423467"
        };
      }
      
      // Add location for Physical Store flow
      if (flowId === "Physical_Store_Based_Gift_Cards") {
        (baseFulfillment.stops[0] as any).location = { gps: "28.524596, 77.185577" };
      }
      
      return baseFulfillment;
    });
    
    console.log("Applied Update request with UPDATE_RECEIVER_INFO tags for flow:", flowId);
    console.log("Update - Final fulfillments:", JSON.stringify(existingPayload.message.order.fulfillments, null, 2));
  }
  
  return existingPayload;
} 