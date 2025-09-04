import dayjs from "dayjs";

/**
 * ON_SEARCH_SELLER_PAGINATION_3 GENERATOR
 * 
 * PURPOSE:
 * This is the THIRD PAGE of paginated search results for TRV14 (Travel) domain.
 * It provides the complete catalog with ALL ITEMS, similar to pagination_2 but with different pagination state.
 * 
 * KEY FEATURES:
 * ✅ COMPLETE ITEMS CATALOG - Contains ALL 6 items (I0, I1, I2, I3, I4, I5)
 * ✅ SAME PROVIDER - Uses identical provider (P1) as pagination_1 and pagination_2
 * ✅ ADVANCED TIME SYNC - Synchronizes time across provider, fulfillments, and items
 * ✅ FULFILLMENT TIME MANAGEMENT - Updates both timestamp and range formats
 * ✅ DYNAMIC CONTENT - Uses session data for payment, tags, and time
 * ✅ BUSINESS TERMS - Includes BAP/BPP terms and pagination info
 * 
 * PAGINATION FLOW:
 * Page 1 (pagination_1): Metadata only (no items) - establishes foundation
 * Page 2 (pagination_2): Complete catalog with ALL items - CURRENT_PAGE_NUMBER: 1
 * Page 3 (this): Complete catalog with ALL items - CURRENT_PAGE_NUMBER: 2
 * 
 * PROVIDER CONSISTENCY:
 * - SAME provider ID (P1) across all pagination pages
 * - SAME categories, locations, and basic structure
 * - SAME items catalog (all 6 items) as pagination_2
 * - DIFFERENT: Pagination tags (CURRENT_PAGE_NUMBER: 2, pagination_2 has: 1)
 * 
 * SESSION DATA USED:
 * - sessionData.collected_by: Sets payment collection method
 * - sessionData.tags: Sets business terms and pagination tags
 * - sessionData.start_time: Start of availability window
 * - sessionData.end_time: End of availability window
 * 
 * TEMPLATE DATA USED:
 * - existingPayload.items: Complete items catalog from default.yaml (ALL 6 items)
 * 
 * ADVANCED TIME SYNCHRONIZATION:
 * 1. Provider time: Random date generation within search range
 * 2. Fulfillment time: Syncs with provider time (handles timestamp & range)
 * 3. Item time: Merges provider time with existing item time properties
 * 
 * RESPONSE STRUCTURE:
 * {
 *   catalog: {
 *     descriptor: { provider catalog info },
 *     providers: [{
 *       id: "P1", // SAME as pagination_1 and pagination_2
 *       descriptor: { provider details },
 *       categories: [{ service categories }],
 *       time: { dynamic availability window },
 *       locations: [{ service locations }],
 *       items: [{ I0, I1, I2, I3, I4, I5 }], // ✅ FULL CATALOG (same as pagination_2)
 *       fulfillments: [{ with synchronized timestamps }],
 *       payments: [{ payment config }]
 *     }],
 *     tags: [{ business terms, pagination: CURRENT_PAGE_NUMBER: 2 }]
 *   }
 * }
 * 
 * FULFILLMENT TIME HANDLING:
 * - Supports both timestamp and range formats in fulfillment stops
 * - Automatically detects format and updates accordingly
 * - Ensures consistency across all time-related fields
 * 
 * IMPORTANT NOTES:
 * - This is the FINAL page with complete item catalog (same as pagination_2)
 * - Provider structure is IDENTICAL to pagination_1 and pagination_2 (same P1)
 * - Items come from existingPayload template (default.yaml), NOT session
 * - sessionData.items doesn't exist yet - gets saved AFTER response generation
 * - Time synchronization is identical to pagination_2
 * - This page contains the actual searchable/selectable items
 * - Main difference from pagination_2: CURRENT_PAGE_NUMBER: 2 vs 1
 */

function getRandomDateBetween(start: any, end: any) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const diff = endDate.diff(startDate, 'day');
  const randomOffset = Math.floor(Math.random() * (diff + 1));
  return startDate.add(randomOffset, 'day');
}

export async function onSearchSellerPagination3Generator(existingPayload: any, sessionData: any) {
  const provider = existingPayload.message.catalog.providers[0];
  
  // Set collected_by from session data
  if (sessionData.collected_by && provider.payments && provider.payments[0]) {
    provider.payments[0].collected_by = sessionData.collected_by;
  }
  
  // Set tags (includes business terms and pagination info)
  // if (sessionData.tags) {
  //   existingPayload.message.catalog.tags .push( sessionData.tags);
  // }
  
  // Set dynamic timerange with random date generation
  if (sessionData.start_time && sessionData.end_time) {
    // const randomDate = getRandomDateBetween(sessionData.start_time, sessionData.end_time);
    provider.time = {
      range: {
        // start: randomDate.hour(5).minute(30).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        // end: randomDate.hour(23).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        start: sessionData.start_time,
        end: sessionData.end_time
      }
    };
    
    // ADVANCED: Set fulfillments stops time fields to match provider time window
    // Handles both timestamp and range formats for maximum compatibility
    if (Array.isArray(provider.fulfillments)) {
      provider.fulfillments.forEach((fulfillment: any) => {
        if (Array.isArray(fulfillment.stops)) {
          fulfillment.stops.forEach((stop: any) => {
            if (stop.time) {
              if ('timestamp' in stop.time) {
                stop.time.timestamp = provider.time.range.start;
              }
              if ('range' in stop.time) {
                stop.time.range.start = provider.time.range.start;
                stop.time.range.end = provider.time.range.end;
              }
            }
          });
        }
      });
    }

    // Sync item times with provider time if items exist in template
    if (Array.isArray(provider.items)) {
      provider.items = provider.items.map((item: any) => {
        // Merge provider time with existing item time properties from template
        item.time = { ...item.time, ...provider.time };
        return item;
      });
    }
  }

  // NOTE: Items come from existingPayload (default.yaml template), NOT from sessionData
  // sessionData.items doesn't exist yet during on_search generation
  // Items will be saved to session AFTER this response is generated

  return existingPayload;
} 