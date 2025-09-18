export async function onStatusUnsolicitedGenerator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }

  console.log("sessionData for on_status_unsolicited", sessionData);

  const submission_id = sessionData?.form_data?.kyc_verification_status?.form_submission_id;
  console.log("form_data ------->", sessionData?.form_data?.kyc_verification_status);

  const form_status = sessionData?.form_data?.kyc_verification_status?.idType;
  
  // Update order ID from session data if available
  if (sessionData.order_id) {
    existingPayload.message = existingPayload.message || {};
    existingPayload.message.order = existingPayload.message.order || {};
    existingPayload.message.order.id = sessionData.order_id;
  }

  // Update provider information from session data
  if (sessionData.provider_id) {
    existingPayload.message = existingPayload.message || {};
    existingPayload.message.order = existingPayload.message.order || {};
    existingPayload.message.order.provider = existingPayload.message.order.provider || {};
    existingPayload.message.order.provider.id = sessionData.provider_id;
  }

  // Update form response status - on_status_unsolicited uses APPROVED status
  if (existingPayload.message?.order?.items?.[0]?.xinput?.form_response) {
    const formResponse = existingPayload.message.order.items[0].xinput.form_response;
    if (sessionData.form_status) {
      formResponse.status = sessionData.form_status;
    } else {
      formResponse.status = "APPROVED";
    }
    
    // Update submission ID if provided
    if (sessionData.submission_id) {
      formResponse.submission_id = sessionData.submission_id;
    }
  }

  // Update fulfillment state based on session data or default to SANCTIONED
  if (existingPayload.message?.order?.fulfillments?.[0]) {
    const fulfillment = existingPayload.message.order.fulfillments[0];
    fulfillment.state = fulfillment.state || {};
    fulfillment.state.descriptor = fulfillment.state.descriptor || {};
    
    // Set status based on session data or default
    if (sessionData.loan_status) {
      fulfillment.state.descriptor.code = sessionData.loan_status;
    } else {
      fulfillment.state.descriptor.code = "SANCTIONED";
    }
    
    fulfillment.state.descriptor.name = fulfillment.state.descriptor.name || "Loan Sanctioned";
    fulfillment.state.descriptor.short_desc = fulfillment.state.descriptor.short_desc || "Loan has been sanctioned and is ready for disbursement";
  }

  // Note: Gold loans don't have payments in status responses
  // Payments are handled separately during loan servicing (EMIs, foreclosure, etc.)

  // Update quote information if provided
  if (sessionData.quote_amount && existingPayload.message?.order?.quote) {
    existingPayload.message.order.quote.price.value = sessionData.quote_amount;
  }

  // Update loan amount in items if provided
  if (sessionData.loan_amount && existingPayload.message?.order?.items?.[0]) {
    existingPayload.message.order.items[0].price.value = sessionData.loan_amount;
  }

  if(existingPayload.message?.order?.items?.[0]?.xinput?.form_response){
    existingPayload.message.order.items[0].xinput.form_response.submission_id = submission_id;
  }

  if(form_status){
    existingPayload.message.order.items[0].xinput.form_response.status = form_status;
  }
  return existingPayload;
}
