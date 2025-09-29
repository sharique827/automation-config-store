/**
 * Confirm Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp and correct action
 * 2. Update transaction_id and message_id from session data
 * 3. Handle different fulfillment types and item configurations based on flow context
 * 4. Map fulfillments, items, and provider from previous flow
 * 5. Update payments with transaction_id and amount from session
 */

import { v4 as uuidv4 } from "uuid";

export async function confirmDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("Confirm generator - Available session data:", {
    order: !!sessionData.order,
    flow_id: sessionData.flow_id,
    on_init_fulfillments: !!sessionData.on_init_fulfillments,
    on_init_items: !!sessionData.on_init_items
  });

  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Preserve the original message_id from the confirm request
  if (existingPayload.context) {
    console.log("Using original message_id from confirm request:", existingPayload.context.message_id);
  }
  
  // Handle order structure based on flow context
  if (existingPayload.message && existingPayload.message.order) {
    const flowId = sessionData.flow_id;
    
    // Get fulfillments and items from on_init response (stored in session data)
    let onInitFulfillments = sessionData.on_init_fulfillments || [];
    let onInitItems = sessionData.on_init_items || [];
    
    // Fallback: if on_init data is not available, create default ones based on flow
    if (onInitFulfillments.length === 0) {
      console.log("No on_init fulfillments found, creating default fulfillments based on flow");
      const itemCount = sessionData.selected_items ? sessionData.selected_items.length : 3;
      
      if (flowId === "Physical_Store_Based_Gift_Cards") {
        onInitFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else if (flowId === "Seller_App_Fulfilling") {
        onInitFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BPP_ONLINE_EMAIL_SMS"
        }));
      } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
        onInitFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      } else {
        // Default fallback
        onInitFulfillments = Array.from({ length: itemCount }, (_, i) => ({
          id: `F${i + 1}`,
          type: "BAP"
        }));
      }
    }
    
    if (onInitItems.length === 0) {
      onInitItems = sessionData.selected_items || [{ id: "GC1" }];
    }
    
    const fulfillmentIds = onInitFulfillments.map((f: any) => f.id);
    
    console.log("Confirm - Flow:", flowId, "Fulfillments:", onInitFulfillments.length, "Items:", onInitItems.length);
    
    if (flowId === "Physical_Store_Based_Gift_Cards") {
      // Physical Store Gift Cards - BAP fulfillments with location details + location_ids
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations in confirm
      };
      
      existingPayload.message.order.fulfillments = onInitFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        type: "BAP",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            location: { gps: "28.524596, 77.185577" },
            person: { name: `Receiver Name ${index + 1}` }
          }
        ]
      }));
      
      existingPayload.message.order.items = onInitItems.map((item: any) => ({
        ...item,
        location_ids: ["L1"],
        fulfillment_ids: fulfillmentIds
      }));
      
      existingPayload.message.order.payments = [
        {
          collected_by: "BPP",
          status: "NOT-PAID",
          tags: [
            {
              descriptor: {
                code: "BUYER_FINDER_FEES"
              },
              list: [
                {
                  descriptor: {
                    code: "BUYER_FINDER_FEES_PERCENTAGE"
                  },
                  value: "3"
                }
              ]
            }
          ],
          type: "ON-ORDER",
          url: "https://sellerpaymentgateway.com/123456"
        }
      ];
      
      console.log("Applied Physical_Store_Based_Gift_Cards: BAP fulfillments with location + location_ids");
      
    } else if (flowId === "Seller_App_Fulfilling") {
      // Seller App Fulfilling - BPP_ONLINE_EMAIL_SMS fulfillments without location
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations in confirm
      };
      
      existingPayload.message.order.fulfillments = onInitFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        type: "BPP_ONLINE_EMAIL_SMS",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` }
            // No location.gps for electronic delivery
          }
        ]
      }));
      
      existingPayload.message.order.items = onInitItems.map((item: any) => ({
        ...item,
        // No location_ids for electronic delivery
        fulfillment_ids: fulfillmentIds
      }));
      
      existingPayload.message.order.payments = [
        {
          collected_by: "BPP",
          status: "NOT-PAID",
          tags: [
            {
              descriptor: {
                code: "BUYER_FINDER_FEES"
              },
              list: [
                {
                  descriptor: {
                    code: "BUYER_FINDER_FEES_PERCENTAGE"
                  },
                  value: "3"
                }
              ]
            }
          ],
          type: "ON-ORDER",
          url: "https://sellerpaymentgateway.com/123456"
        }
      ];
      
      console.log("Applied Seller_App_Fulfilling: BPP_ONLINE_EMAIL_SMS fulfillments without location");
      
    } else if (flowId === "Buyer_App_Fulfilling_Code_On_Confirm" || flowId === "Buyer_App_Fulfilling_Code_On_Update") {
      // Buyer App Fulfilling - BAP fulfillments without location
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations in confirm
      };
      
      existingPayload.message.order.fulfillments = onInitFulfillments.map((fulfillment: any, index: number) => ({
        id: fulfillment.id,
        type: "BAP",
        stops: [
          {
            contact: { phone: `999988886${7 + index}`, email: `receiver${index + 1}@test.com` },
            person: { name: `Receiver Name ${index + 1}` }
            // No location.gps for electronic delivery
          }
        ]
      }));
      
      existingPayload.message.order.items = onInitItems.map((item: any) => ({
        ...item,
        // No location_ids for electronic delivery
        fulfillment_ids: fulfillmentIds
      }));
      
      existingPayload.message.order.payments = [
        {
          collected_by: "BPP",
          status: "NOT-PAID",
          tags: [
            {
              descriptor: {
                code: "BUYER_FINDER_FEES"
              },
              list: [
                {
                  descriptor: {
                    code: "BUYER_FINDER_FEES_PERCENTAGE"
                  },
                  value: "3"
                }
              ]
            }
          ],
          type: "ON-ORDER",
          url: "https://sellerpaymentgateway.com/123456"
        }
      ];
      
      console.log("Applied Buyer_App_Fulfilling: BAP fulfillments without location");
      
    } else {
      // Default fallback - use session data or default structure
      if (sessionData.selected_items) {
        // Get the default items with tags from the existing payload
        const defaultItems = existingPayload.message.order.items || [];
        
        // Map session items to include tags from default.yaml
        existingPayload.message.order.items = sessionData.selected_items.map((sessionItem: any, index: number) => {
          // Try to find matching item by ID first
          let defaultItem = defaultItems.find((item: any) => item.id === sessionItem.id);
          
          // If no match by ID, use the item at the same index
          if (!defaultItem && defaultItems[index]) {
            defaultItem = defaultItems[index];
          }
          
          // If still no default item, use the first one as fallback
          if (!defaultItem && defaultItems.length > 0) {
            defaultItem = defaultItems[0];
          }
          
          return {
            ...sessionItem,
            // Preserve tags from default.yaml if available
            ...(defaultItem && defaultItem.tags && { tags: defaultItem.tags })
          };
        });
      }
      
      if (sessionData.selected_fulfillments) {
        // Get the default fulfillments with stops from the existing payload
        const defaultFulfillments = existingPayload.message.order.fulfillments || [];
        
        // Map session fulfillments to include stops from default.yaml
        existingPayload.message.order.fulfillments = sessionData.selected_fulfillments.map((sessionFulfillment: any, index: number) => {
          // Try to find matching fulfillment by ID first
          let defaultFulfillment = defaultFulfillments.find((f: any) => f.id === sessionFulfillment.id);
          
          // If no match by ID, use the fulfillment at the same index
          if (!defaultFulfillment && defaultFulfillments[index]) {
            defaultFulfillment = defaultFulfillments[index];
          }
          
          // If still no default fulfillment, use the first one as fallback
          if (!defaultFulfillment && defaultFulfillments.length > 0) {
            defaultFulfillment = defaultFulfillments[0];
          }
          
          return {
            id: sessionFulfillment.id,
            type: sessionFulfillment.type,
            // Preserve stops from default.yaml if available
            ...(defaultFulfillment && defaultFulfillment.stops && { stops: defaultFulfillment.stops })
          };
        });
      }
      
      if (sessionData.selected_provider) {
        existingPayload.message.order.provider = sessionData.selected_provider;
      }
      
      console.log("Using default/session data for confirm order structure");
    }
    
    // Load billing from session with required fields preservation
    if (sessionData.billing) {
      // Get the default billing from the existing payload
      const defaultBilling = existingPayload.message.order.billing || {};
      
      // Merge session billing with default billing, preserving required fields
      existingPayload.message.order.billing = {
        ...defaultBilling,
        ...sessionData.billing
      };
    }
    
    // Load tags from session (BAP_TERMS and BPP_TERMS)
    if (sessionData.tags) {
      existingPayload.message.order.tags = sessionData.tags;
    }
    
    // Update quote values while preserving the correct breakup structure from default.yaml
    if (existingPayload.message.order.items && Array.isArray(existingPayload.message.order.items)) {
      let totalValue = 0;
      
      existingPayload.message.order.items.forEach((item: any) => {
        if (item.price && item.price.value) {
          const itemValue = parseFloat(item.price.value);
          const quantity = item.quantity?.selected?.count || 1;
          totalValue += itemValue * quantity;
        }
      });
      
      // Preserve the default quote structure and only update values
      const defaultQuote = existingPayload.message.order.quote || {};
      
      existingPayload.message.order.quote = {
        ...defaultQuote,
        price: {
          ...defaultQuote.price,
          value: totalValue.toString()
        },
        // Preserve the default breakup structure with correct titles
        breakup: defaultQuote.breakup || []
      };
      
      console.log("Updated quote with total value:", totalValue);
    }
    
    // Update payments with transaction_id and amount from session
    if (existingPayload.message.order.payments && Array.isArray(existingPayload.message.order.payments)) {
      existingPayload.message.order.payments.forEach((payment: any) => {
        if (payment.params) {
          // Update transaction_id from session
          if (sessionData.transaction_id) {
            payment.params.transaction_id = sessionData.transaction_id;
          }
        }
      });
    }
  }
  
  return existingPayload;
}
