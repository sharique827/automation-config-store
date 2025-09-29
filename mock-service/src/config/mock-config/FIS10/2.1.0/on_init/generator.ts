/**
 * On Init Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Handle different fulfillment types and provider structures based on flow context
 * 4. Map fulfillments, items, and provider from previous flow
 */

import { v4 as uuidv4 } from "uuid";

export async function onInitDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("On Init generator - Available session data:", {
    order: !!sessionData.order,
    flow_id: sessionData.flow_id,
    init_fulfillments: !!sessionData.init_fulfillments,
    init_items: !!sessionData.init_items
  });

  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Keep the original message_id from the init request (should match init message_id)
  // The on_init response should echo back the same message_id as the init request
  if (existingPayload.context) {
    console.log("Using message_id from init request context:", existingPayload.context.message_id);
  }
  
  // Handle order structure based on flow context
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
    
    console.log("On Init - Flow:", flowId, "Fulfillments:", onSelectFulfillments.length, "Fulfillment IDs:", fulfillmentIds);
    
    if (flowId === "Physical_Store_Based_Gift_Cards") {
      // Physical Store Gift Cards - BAP fulfillments with location details
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
      
      existingPayload.message.order.fulfillments = onSelectFulfillments.map((fulfillment: any, index: number) => ({
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
      
      console.log("Applied Physical_Store_Based_Gift_Cards: BAP fulfillments with location + provider locations");
      
    } else if (flowId === "Seller_App_Fulfilling") {
      // Seller App Fulfilling - BPP_ONLINE_EMAIL_SMS fulfillments without location
      existingPayload.message.order.provider = {
        id: "P1"
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = onSelectFulfillments.map((fulfillment: any, index: number) => ({
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
        // No locations for electronic delivery
      };
      
      existingPayload.message.order.fulfillments = onSelectFulfillments.map((fulfillment: any, index: number) => ({
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
      if (sessionData.order && existingPayload.message) {
        const sessionOrder = sessionData.order;
        const defaultOrder = existingPayload.message.order || {};
        
        // Merge order data, preserving default values
        existingPayload.message.order = {
          ...defaultOrder,
          ...sessionOrder,
          
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
          
          // Handle other order fields
          ...(sessionOrder.offers && { offers: sessionOrder.offers }),
          ...(sessionOrder.quote && { quote: sessionOrder.quote }),
          ...(sessionOrder.payments && { payments: sessionOrder.payments }),
          ...(sessionOrder.tags && { tags: sessionOrder.tags })
        };
      }
      console.log("Using default/session data for on_init order structure");
    }
  }
  
  return existingPayload;
}
