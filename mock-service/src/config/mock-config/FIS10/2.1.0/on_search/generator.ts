/**
 * On Search Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load catalog data from session data
 */
export async function onSearchDefaultGenerator(existingPayload: any, sessionData: any) {
console.log("existingPayload on search", existingPayload);
    const provider = existingPayload.message.catalog.providers[0];
  // Set payment_collected_by if present
  if (sessionData.collected_by && existingPayload.message?.catalog?.providers?.[0]?.payments?.[0]) {
      existingPayload.message.catalog.providers[0].payments[0].collected_by = sessionData.collected_by;
  }

  if (sessionData.message_id && existingPayload.context) {
    existingPayload.context.message_id = sessionData.message_id;
  }
  console.log("sessionData.message_id", sessionData.message_id);
  // Set timerange
  if (sessionData.start_time && sessionData.end_time) {
    // const randomDate = getRandomDateBetween(sessionData.start_time, sessionData.end_time);
    provider.time = {
      range: {
        // start: randomDate.hour(5).minute(30).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        // end: randomDate.hour(23).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
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
  console.log("session data of on_search", sessionData)
  return existingPayload;
} 