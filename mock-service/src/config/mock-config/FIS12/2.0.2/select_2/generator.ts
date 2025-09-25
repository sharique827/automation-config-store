export async function select2Generator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) existingPayload.context.timestamp = new Date().toISOString();
  const submission_id = sessionData?.form_data?.consumer_information_form?.form_submission_id;

  // Map provider and item from on_search selections
  const selectedProvider = sessionData.selected_provider;
  const selectedItem = sessionData.item || (Array.isArray(sessionData.items) ? sessionData.items[0] : undefined);

  existingPayload.message = existingPayload.message || {};
  existingPayload.message.order = existingPayload.message.order || {};
  existingPayload.message.order.provider = existingPayload.message.order.provider || {};
  existingPayload.message.order.items = existingPayload.message.order.items || [{}];

  if (selectedProvider?.id) {
    existingPayload.message.order.provider.id = selectedProvider.id;
  }
  if (selectedItem?.id && existingPayload.message.order.items[0]) {
    existingPayload.message.order.items[0].id = selectedItem.id;
  }

  // Ensure a single selected location id is present and normalized
  const inputLocationId = existingPayload.message?.order?.items?.[0]?.location_ids?.[0];
  const sessionLocationId = sessionData.selected_location_id;
  const providerLocations = Array.isArray(selectedProvider?.locations) ? selectedProvider.locations : [];
  const fallbackLocationId = providerLocations[0]?.id;
  const chosenLocationId = inputLocationId || sessionLocationId || fallbackLocationId;

  if (chosenLocationId && existingPayload.message?.order?.items?.[0]) {
    existingPayload.message.order.items[0].location_ids = [chosenLocationId];
  }

  if(existingPayload.message?.order?.items?.[0]?.xinput?.form_response){
    existingPayload.message.order.items[0].xinput.form_response.submission_id = submission_id;
  }

  return existingPayload;
}

