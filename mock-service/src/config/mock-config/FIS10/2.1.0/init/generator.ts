/**
 * Init Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp and correct action
 * 2. Update transaction_id and message_id from session data
 * 3. Handle different fulfillment types and item configurations based on flow context
 * 4. Update billing and tags from session data
 */

import { v4 as uuidv4 } from "uuid";

export async function initDefaultGenerator(existingPayload: any, sessionData: any) {
  // Update context timestamp and action
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
    existingPayload.context.action = "init";
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Keep the original message_id from the init request
  if (existingPayload.context) {
    console.log("Using original message_id from init request:", existingPayload.context.message_id);
  }
  
  // Handle fulfillments and items based on flow context
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    
    // Get fulfillment IDs from on_select response (stored in session data)
    let onSelectFulfillments = sessionData.on_select_fulfillments || [];
    let fulfillmentIds = onSelectFulfillments.map((f: any) => f.id);
    
    // Fallback: if on_select fulfillments are not available, create default ones based on flow
    if (onSelectFulfillments.length === 0) {
      console.log("No on_select fulfillments found, creating default fulfillments based on flow");
      const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
      
      if (flowId === "Physical_Store_Based_Gift_Cards") {
        onSelectFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else if (flowId === "Seller_App_Fulfilling") {
        onSelectFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BPP_ONLINE_EMAIL_SMS"
        }));
      } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
        onSelectFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else {
        // Default fallback
        onSelectFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      }
      
      fulfillmentIds = onSelectFulfillments.map((f: any) => f.id);
    }
    
    console.log("Init generator - Debug info:", {
      flowId: flowId,
      onSelectFulfillments: onSelectFulfillments,
      fulfillmentIds: fulfillmentIds,
      sessionDataKeys: Object.keys(sessionData)
    });
    
    if (flowId === "Physical_Store_Based_Gift_Cards") {
      // Physical store gift cards - BAP fulfillment with location details
      existingPayload.message.order.fulfillments = onSelectFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        type: "BAP",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` },
            location: { gps: "28.524596, 77.185577" }
          }
        ]
      }));
      
      // Items with location_ids for physical delivery
      existingPayload.message.order.items = [
        {
          id: "GC1",
          quantity: { selected: { count: 3 } },
          location_ids: ["L1"],
          fulfillment_ids: fulfillmentIds,
          tags: [
            {
              descriptor: { code: "CUSTOMIZATION" },
              list: [
                { descriptor: { code: "RECEIVER_NAME" }, value: "Test Name" },
                { descriptor: { code: "MESSAGE" }, value: "Happy Birthday to you!!" }
              ]
            }
          ]
        }
      ];
      console.log("Applied Physical_Store_Based_Gift_Cards: BAP fulfillments with location + location_ids, fulfillment_ids:", fulfillmentIds);
      
    } else if (flowId === "Seller_App_Fulfilling") {
      // Seller app fulfilling - BPP_ONLINE_EMAIL_SMS (no location)
      existingPayload.message.order.fulfillments = onSelectFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        type: "BPP_ONLINE_EMAIL_SMS",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` }
          }
        ]
      }));
      
      // Items without location_ids (electronic delivery)
      existingPayload.message.order.items = [
        {
          id: "GC1",
          quantity: { selected: { count: 3 } },
          fulfillment_ids: fulfillmentIds,
          tags: [
            {
              descriptor: { code: "CUSTOMIZATION" },
              list: [
                { descriptor: { code: "RECEIVER_NAME" }, value: "Test Name" },
                { descriptor: { code: "MESSAGE" }, value: "Happy Birthday to you!!" }
              ]
            }
          ]
        }
      ];
      console.log("Applied Seller_App_Fulfilling: BPP_ONLINE_EMAIL_SMS fulfillments without location, fulfillment_ids:", fulfillmentIds);
      
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      // Buyer app fulfilling - BAP (no location, electronic delivery)
      existingPayload.message.order.fulfillments = [
        {
          id: "F1",
          type: "BAP",
          stops: [
            {
              contact: { phone: "9999888867", email: "receiver1@test.com" },
              person: { name: "Receiver Name 1" }
            }
          ]
        },
        {
          id: "F2",
          type: "BAP",
          stops: [
            {
              contact: { phone: "9999888868", email: "receiver2@test.com" },
              person: { name: "Receiver Name 2" }
            }
          ]
        },
        {
          id: "F3",
          type: "BAP",
          stops: [
            {
              contact: { phone: "9999888869", email: "receiver3@test.com" },
              person: { name: "Receiver Name 3" }
            }
          ]
        }
      ];
      
      // Items without location_ids (electronic delivery)
      existingPayload.message.order.items = [
        {
          id: "GC1",
          quantity: { selected: { count: 3 } },
          fulfillment_ids: ["F1", "F2", "F3"],
          tags: [
            {
              descriptor: { code: "CUSTOMIZATION" },
              list: [
                { descriptor: { code: "RECEIVER_NAME" }, value: "Test Name" },
                { descriptor: { code: "MESSAGE" }, value: "Happy Birthday to you!!" }
              ]
            }
          ]
        }
      ];
      console.log("Applied Buyer_App_Fulfilling: BAP fulfillments without location");
      
    } else {
      // Default fallback - use session data or default structure
      if (sessionData.selected_items && existingPayload.message && existingPayload.message.order) {
        // Ensure items have required CUSTOMIZATION tags
        existingPayload.message.order.items = sessionData.selected_items.map((item: any) => ({
          ...item,
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
      
      // Don't override flow-based fulfillments with session data that might be missing stops
      // The flow-based logic above already handles fulfillments properly
      console.log("Using flow-based fulfillments and items with CUSTOMIZATION tags");
    }
  }
  
  // Load provider from session
  if (sessionData.selected_provider && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  
  // Load billing from session
  if (sessionData.billing && existingPayload.message && existingPayload.message.order) {
    // Get the default billing from the existing payload
    const defaultBilling = existingPayload.message.order.billing || {};
    
    // Merge session billing with default billing, preserving required fields
    existingPayload.message.order.billing = {
      ...defaultBilling,
      ...sessionData.billing
    };
  }
  
  // Load tags from session (BAP_TERMS and BPP_TERMS)
  if (sessionData.tags && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.tags = sessionData.tags;
  }
  
  return existingPayload;
}
