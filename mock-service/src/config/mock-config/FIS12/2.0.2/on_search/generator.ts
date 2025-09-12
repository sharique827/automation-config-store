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
  console.log("sessionData.message_id", sessionData);
 

    // Sync item times with provider time if items exist in template
    if (Array.isArray(provider.items)) {
      provider.items = provider.items.map((item: any) => {
        // Merge provider time with existing item time properties from template
        const url = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/consumer_information_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;
        console.log("urllllllllll", url);
        item.xinput.form.url = url;
        return item;
      });
    }
  console.log("session data of on_search", sessionData)
  return existingPayload;
} 