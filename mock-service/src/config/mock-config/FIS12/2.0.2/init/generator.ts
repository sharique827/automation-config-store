/**
 * Init Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp and correct action
 * 2. Update transaction_id and message_id from session data
 * 3. Load items, fulfillments, and provider from session data
 * 4. Update billing and tags from session data
 */

export async function initDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("sessionData for init", sessionData);
  // Update context timestamp and action
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
    existingPayload.context.action = "init";
  }

  const submission_id = sessionData?.form_data?.loan_adjustment_form?.form_submission_id;
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  // Load items from session (fallback to selected item from on_select phase)
  if (existingPayload.message && existingPayload.message.order) {
    if (sessionData.selected_items) {
      console.log("sessionData.selected_items", sessionData.selected_items);
      existingPayload.message.order.items = sessionData.selected_items;
    } else if (sessionData.item) {
      existingPayload.message.order.items = [sessionData.item];
    }
  }
  
  // // Load fulfillments from session
  // if (sessionData.selected_fulfillments && existingPayload.message && existingPayload.message.order) {
  //   existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
  // }
  
  // Load provider from session
  if (sessionData.selected_provider && existingPayload.message && existingPayload.message.order) {
    console.log("sessionData.selected_provider", sessionData.selected_provider);
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  
  // Load tags from session (BAP_TERMS and BPP_TERMS)
  if (sessionData.tags && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.tags = sessionData.tags;
  }
  
  // Ensure xinput.form id from on_select step is retained for FO3 and set form_response as per request
  const item0 = existingPayload.message?.order?.items?.[0];
  if (item0 && sessionData.item?.xinput?.form?.id) {
    item0.xinput = item0.xinput || {};
    item0.xinput.form = item0.xinput.form || {};
    if (!item0.xinput.form.id) item0.xinput.form.id = sessionData.item.xinput.form.id;
  }
  if(existingPayload.message?.order?.items?.[0]?.xinput?.form_response){
    existingPayload.message.order.items[0].xinput.form_response.submission_id = submission_id;
  }

  return existingPayload;
}
