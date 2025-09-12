export async function onSelect2Generator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }

  console.log("sessionData for on_select_2", sessionData);
  const provider = sessionData.selected_provider;
  const selectedItem = sessionData.item || (Array.isArray(sessionData.items) ? sessionData.items[0] : undefined);

  existingPayload.message = existingPayload.message || {};
  existingPayload.message.order = existingPayload.message.order || {};
  existingPayload.message.order.provider = existingPayload.message.order.provider || {};
  existingPayload.message.order.items = existingPayload.message.order.items || [{}];

  // Provider mapping and include provider.locations object in on_select_2 (second response)
  if (provider) {
    existingPayload.message.order.provider.id = provider.id || existingPayload.message.order.provider.id;
    if (provider.descriptor) existingPayload.message.order.provider.descriptor = provider.descriptor;
    if (Array.isArray(provider.tags)) existingPayload.message.order.provider.tags = provider.tags;
    if (Array.isArray(provider.locations)) existingPayload.message.order.provider.locations = provider.locations;
  }

  // Generate loan adjustment form URL for on_select_2
  if (existingPayload.message?.order?.items?.[0]?.xinput?.form) {
    const url = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/loan_adjustment_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;
    console.log("URL for loan_adjustment_form in on_select_2", url);
    existingPayload.message.order.items[0].xinput.form.url = url;
  }

  // Item id mapping and location_ids normalization (single location)
  if (selectedItem?.id && existingPayload.message.order.items[0]) {
    existingPayload.message.order.items[0].id = selectedItem.id;
  }
  const selectedLocation = sessionData.selected_location_id || existingPayload.message.order.items[0]?.location_ids?.[0];
  if (selectedLocation) {
    existingPayload.message.order.items[0].location_ids = [selectedLocation];
  }

  return existingPayload;
}

