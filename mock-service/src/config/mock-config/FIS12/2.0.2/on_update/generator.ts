/**
 * On Update Generator for FIS12
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load order data from session data
 */

export async function onUpdateDefaultGenerator(existingPayload: any, sessionData: any) {
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
  
  // Load order from session data
  if (existingPayload.message) {
    const order = existingPayload.message.order || (existingPayload.message.order = {});

    // Keep order id consistent if available
    if (sessionData.order_id) {
      order.id = sessionData.order_id;
    }

    // Map provider details from session if available
    if (sessionData.selected_provider) {
      const provider = sessionData.selected_provider;
      order.provider = order.provider || {};
      order.provider.id = provider.id || order.provider.id;
      if (provider.descriptor) order.provider.descriptor = provider.descriptor;
      if (Array.isArray(provider.tags)) order.provider.tags = provider.tags;
      if (Array.isArray(provider.locations)) order.provider.locations = provider.locations;
    }

    // Ensure items array exists and map item id if present in session
    const selectedItem = sessionData.item || (Array.isArray(sessionData.items) ? sessionData.items[0] : undefined);
    order.items = order.items || [{}];
    if (selectedItem?.id) {
      order.items[0].id = selectedItem.id;
    }
  }

  // Helper to upsert a breakup line
  function upsertBreakup(order: any, title: string, value: string, currency: string = 'INR') {
    order.quote = order.quote || { price: { currency: 'INR', value: '0' }, breakup: [] };
    order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];
    const idx = order.quote.breakup.findIndex((b: any) => (b.title || '').toUpperCase() === title.toUpperCase());
    const row = { title, price: { value, currency } };
    if (idx >= 0) order.quote.breakup[idx] = row; else order.quote.breakup.push(row);
  }

  // Helper to recompute quote.price.value as sum excluding NET_DISBURSED_AMOUNT
  function recomputeQuoteTotal(order: any) {
    if (!order?.quote?.breakup) return;
    const total = order.quote.breakup.reduce((sum: number, r: any) => {
      const t = (r?.title || '').toUpperCase();
      const v = Number(r?.price?.value);
      if (!Number.isNaN(v) && t !== 'NET_DISBURSED_AMOUNT') return sum + v;
      return sum;
    }, 0);
    order.quote.price = order.quote.price || { currency: 'INR', value: '0' };
    order.quote.price.value = String(total);
    // Keep item[0].price in sync if present
    if (order.items?.[0]) {
      order.items[0].price = order.items[0].price || { currency: order.quote.price.currency || 'INR', value: '0' };
      order.items[0].price.currency = order.quote.price.currency || order.items[0].price.currency || 'INR';
      order.items[0].price.value = String(total);
    }
  }

  // Branch by update label
  const orderRef = existingPayload.message?.order || {};
  const label = sessionData.update_label
    || orderRef?.payments?.[0]?.time?.label
    || sessionData.user_inputs?.foreclosure_amount && 'FORECLOSURE'
    || sessionData.user_inputs?.missed_emi_amount && 'MISSED_EMI_PAYMENT'
    || sessionData.user_inputs?.part_payment_amount && 'PRE_PART_PAYMENT'
    || 'FORECLOSURE';

  // Ensure payments structure exists
  orderRef.payments = orderRef.payments || [{}];
  const firstPayment = orderRef.payments[0];
  firstPayment.time = firstPayment.time || {};
  firstPayment.time.label = label;

  if (label === 'FORECLOSURE') {
    // Add/Update foreclosure charges from session (or keep default)
    const fcAmount = sessionData.update_amount || '9536';
    upsertBreakup(orderRef, 'FORCLOSUER_CHARGES', fcAmount);
    // Remove time range for foreclosure
    if (firstPayment.time.range) delete firstPayment.time.range;
  }

  if (label === 'MISSED_EMI_PAYMENT') {
    // Add Late fee and update outstanding interest if available
    const lateFee = sessionData.user_inputs?.late_fee_amount || '1500';
    upsertBreakup(orderRef, 'LATE_FEE_AMOUNT', String(lateFee));
    if (sessionData.user_inputs?.outstanding_interest) {
      upsertBreakup(orderRef, 'OUTSTANDING_INTEREST', String(sessionData.user_inputs.outstanding_interest));
    }
    if (sessionData.user_inputs?.outstanding_principal) {
      upsertBreakup(orderRef, 'OUTSTANDING_PRINCIPAL', String(sessionData.user_inputs.outstanding_principal));
    }

    // Set a time range for the missed EMI window
    const dateStr = sessionData.user_inputs?.missed_emi_date;
    const date = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999)).toISOString();
    firstPayment.time.range = { start, end };

    // Determine payable amount: EMI installment + late fee (or provided amount)
    function parseAmountToNumber(val: any): number {
      if (val === null || val === undefined) return 0;
      const n = Number(String(val).toString().replace(/[^0-9.\-]/g, ''));
      return Number.isNaN(n) ? 0 : n;
    }

    function getInstallmentAmountFromTags(): number {
      const item = orderRef?.items?.[0];
      const tags = Array.isArray(item?.tags) ? item.tags : [];
      // Find LOAN_INFO list item with code INSTALLMENT_AMOUNT
      for (const tag of tags) {
        const list = Array.isArray(tag?.list) ? tag.list : [];
        for (const entry of list) {
          const code = (entry?.descriptor?.code || '').toUpperCase();
          if (code === 'INSTALLMENT_AMOUNT') {
            return parseAmountToNumber(entry?.value);
          }
        }
      }
      return 0;
    }

    const installmentFromInput = parseAmountToNumber(sessionData.user_inputs?.installment_amount);
    const installmentFromTags = getInstallmentAmountFromTags();
    const installment = installmentFromInput || installmentFromTags || 46360;
    const lateFeeNum = parseAmountToNumber(lateFee);
    const providedMissedAmount = parseAmountToNumber(sessionData.user_inputs?.missed_emi_amount);
    const payable = providedMissedAmount || (installment + lateFeeNum);

    // Set payment params and URL
    firstPayment.params = firstPayment.params || {};
    firstPayment.params.amount = String(payable);
    firstPayment.params.currency = firstPayment.params.currency || sessionData.update_currency || 'INR';
    const refIdMissed = sessionData.message_id || orderRef.id || 'ref';
    firstPayment.url = `https://pg.icici.com/?amount=${encodeURIComponent(String(payable))}&ref_id=${encodeURIComponent(refIdMissed)}`;
  }
  
  if (label === 'PRE_PART_PAYMENT') {
    // Map part payment amount into payments and breakup
    const partAmount = String(
      sessionData.update_amount
      || sessionData.user_inputs?.part_payment_amount
      || firstPayment?.params?.amount
      || '0'
    );

    // Upsert breakup line for part payment
    upsertBreakup(orderRef, 'PART_PAYMENT_AMOUNT', partAmount);

    // Ensure payment params and clear any time range
    firstPayment.params = firstPayment.params || {};
    firstPayment.params.amount = partAmount;
    firstPayment.params.currency = firstPayment.params.currency || sessionData.update_currency || 'INR';
    if (firstPayment.time.range) delete firstPayment.time.range;

    // Set/Update PG URL to reflect amount and a ref id
    const refId = sessionData.message_id || orderRef.id || 'ref';
    firstPayment.url = `https://pg.icici.com/?amount=${encodeURIComponent(partAmount)}&ref_id=${encodeURIComponent(refId)}`;
  }

  // Recompute totals after adjustments
  recomputeQuoteTotal(orderRef);
  
  return existingPayload;
}
