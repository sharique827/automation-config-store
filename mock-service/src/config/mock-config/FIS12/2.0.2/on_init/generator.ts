/**
 * On Init Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load order data from session data
 */

export async function onInitDefaultGenerator(existingPayload: any, sessionData: any) {
  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Update message_id from session data
  if (sessionData.message_id && existingPayload.context) {
    existingPayload.context.message_id = sessionData.message_id;
  }
  
  // Merge provider/items from on_select session data where available
  if (existingPayload.message) {
    const order = existingPayload.message.order || (existingPayload.message.order = {});
    const provider = sessionData.selected_provider;
    const selectedItem = sessionData.item || (Array.isArray(sessionData.items) ? sessionData.items[0] : undefined);

    if (provider) {
      order.provider = order.provider || {};
      order.provider.id = provider.id || order.provider.id;
      if (provider.descriptor) order.provider.descriptor = provider.descriptor;
      if (Array.isArray(provider.tags)) order.provider.tags = provider.tags;
      if (Array.isArray(provider.locations)) order.provider.locations = provider.locations;
    }

    order.items = order.items || [{}];
    if (selectedItem?.id) {
      order.items[0].id = selectedItem.id;
    }
    // Normalize a single location id on item from session selection
    const chosenLocationId = sessionData.selected_location_id
      || order.items?.[0]?.location_ids?.[0]
      || (Array.isArray(provider?.locations) ? provider!.locations[0]?.id : undefined);
    if (chosenLocationId) {
      order.items[0].location_ids = [chosenLocationId];
    }
  }

  // Price/Quote calculation: ensure quote.price.value equals sum of breakup components
  const orderRef = existingPayload.message?.order;
  const quote = orderRef?.quote;
  if (quote && Array.isArray(quote.breakup)) {
    const total = quote.breakup.reduce((sum: number, row: any) => {
      const valStr = row?.price?.value;
      const title = (row?.title || '').toUpperCase();
      // Exclude NET_DISBURSED_AMOUNT from summation
      if (valStr != null && title !== 'NET_DISBURSED_AMOUNT') {
        const val = Number(valStr);
        if (!Number.isNaN(val)) return sum + val;
      }
      return sum;
    }, 0);
    if (quote.price) {
      quote.price.value = String(total);
    }
    // Keep item[0].price in sync with quote.price if present
    if (orderRef?.items?.[0]) {
      orderRef.items[0].price = orderRef.items[0].price || { currency: quote.price?.currency || 'INR', value: '0' };
      orderRef.items[0].price.currency = quote.price?.currency || orderRef.items[0].price.currency || 'INR';
      orderRef.items[0].price.value = String(total);
    }
  }
  
  return existingPayload;
}
