/**
 * On Update Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp and correct action
 * 2. Update transaction_id and message_id from session data
 * 3. Handle updated fields and status changes with UPDATE_RECEIVER_INFO tags
 * 4. Map fulfillments and items from previous flow
 */

import { v4 as uuidv4 } from "uuid";

export async function onUpdateDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("On Update generator - Available session data:", {
    order: !!sessionData.order,
    flow_id: sessionData.flow_id,
    update_fulfillments: !!sessionData.update_fulfillments,
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
  
  // Generate new unique message_id for on_update
  if (existingPayload.context) {
    existingPayload.context.message_id = uuidv4();
    console.log("Generated new message_id for on_update:", existingPayload.context.message_id);
  }
  
  // Handle order structure based on flow context
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    
    // Get fulfillments from update request (stored in session data)
    let updateFulfillments = sessionData.update_fulfillments || [];
    
    // Fallback: if update data is not available, use on_status fulfillments
    if (updateFulfillments.length === 0) {
      updateFulfillments = sessionData.on_status_fulfillments || [];
    }
    
    // Fallback: if still no data, create default ones based on flow
    if (updateFulfillments.length === 0) {
      console.log("No update fulfillments found, creating default fulfillments based on flow");
      const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
      
      if (flowId === "Physical_Store_Based_Gift_Cards") {
        updateFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else if (flowId === "Seller_App_Fulfilling") {
        updateFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BPP_ONLINE_EMAIL_SMS"
        }));
      } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
        updateFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else {
        // Default fallback
        updateFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      }
    }
    
    // Ensure order ID matches the previous flow
    const orderId = sessionData.on_confirm_order_id || sessionData.order_id || "O1";
    
    console.log("On Update - Flow:", flowId, "Fulfillments:", updateFulfillments.length);
    
    // Set order ID
    existingPayload.message.order.id = orderId;
    
    // Check if this is Update_Receiver_Info flow (completion notification)
    if (flowId === "Update_Receiver_Info") {
      // Only change status fields for completion notification
      existingPayload.message.order.status = "COMPLETED";
      
      // Update fulfillment states to COMPLETED
      existingPayload.message.order.fulfillments = updateFulfillments.map((fulfillment: any, index: number) => {
        const baseFulfillment = {
          id: fulfillment.id,
          type: fulfillment.type || (flowId === "Seller_App_Fulfilling" ? "BPP_ONLINE_EMAIL_SMS" : "BAP"),
          state: {
            descriptor: { code: "COMPLETED" }
          },
          stops: [
            {
              contact: { 
                phone: "9865432190",  // Updated phone
                email: "updated_rec@test.com"  // Updated email
              },
              person: { 
                name: "Receiver Name 1" 
              }
            }
          ]
        };
        
        // Add authorization for flows that require it
        if (flowId === "Physical_Store_Based_Gift_Cards" || 
            flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || 
            flowId === "Buyer_App_Fulfilling_Code_On_Update" ||
            flowId === "Update_Receiver_Info") {
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
      
      console.log("Applied Update_Receiver_Info completion notification with COMPLETED status");
    } else {
      // Regular update flow with field changes
      existingPayload.message.order.status = "COMPLETED";
      
      // Create on_update response with updated fields
      existingPayload.message.order.fulfillments = updateFulfillments.map((fulfillment: any, index: number) => {
        const baseFulfillment = {
          id: fulfillment.id,
          state: {
            descriptor: { code: "COMPLETED" }
          },
          type: fulfillment.type || (flowId === "Seller_App_Fulfilling" ? "BPP_ONLINE_EMAIL_SMS" : "BAP"),
          stops: [
            {
              contact: { 
                phone: "9865432190",  // Updated phone
                email: "updated_rec@test.com"  // Updated email
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
      
      console.log("Applied On Update response with updated fields and IN_PROGRESS status for flow:", flowId);
    }
  }
  
  return existingPayload;
}
