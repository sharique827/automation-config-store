export async function onSelect1Generator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  const provider = sessionData.selected_provider;
  const selectedItem = sessionData.item || (Array.isArray(sessionData.items) ? sessionData.items[0] : undefined);

  // Provider descriptor and tags mapping
  if (provider) {
    existingPayload.message = existingPayload.message || {};
    existingPayload.message.order = existingPayload.message.order || {};
    existingPayload.message.order.provider = existingPayload.message.order.provider || {};
    existingPayload.message.order.provider.id = provider.id || existingPayload.message.order.provider.id;

    if (provider.descriptor) {
      existingPayload.message.order.provider.descriptor = provider.descriptor;
    }
    if (Array.isArray(provider.tags)) {
      existingPayload.message.order.provider.tags = provider.tags;
    }
  }

  // Item id mapping
  if (selectedItem?.id && existingPayload.message?.order?.items?.[0]) {
    existingPayload.message.order.items[0].id = selectedItem.id;
  }

  // Map location_ids from provider.locations if present
  const locationIds = Array.isArray(provider?.locations)
    ? provider.locations.map((l: any) => l.id).filter(Boolean)
    : [];
  if (locationIds.length > 0 && existingPayload.message?.order?.items?.[0]) {
    existingPayload.message.order.items[0].location_ids = locationIds;
  }

  return existingPayload;
}

