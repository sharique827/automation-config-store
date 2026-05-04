import { SessionData } from "../../../../session-types";

export async function initUnlimitedPassGenerator(
  existingPayload: any,
  sessionData: any,
) {
  existingPayload.context.location.city.code =
    sessionData?.select_city_code ?? "std:080";
  existingPayload.message.order.provider.id =
    sessionData?.select_unlimited_pass_provider_id ?? "Provider1";
  existingPayload.message.order.items = [
    sessionData?.selected_unlimited_pass_item,
  ];
  existingPayload.message.order.fulfillments = [
    sessionData?.selected_unlimited_pass_fulfillments,
  ];

  //______SETTLEMENT_AMOUNT____________
  const tags = existingPayload?.message?.order?.tags;
  if (!tags) return;

  const collectedBy = sessionData?.user_inputs?.collected_by
  const price = Number(sessionData?.quote?.price?.value ?? 0);

  const buyerFinderFeesTag = tags?.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  const feePercentage = Number(
    buyerFinderFeesTag?.list?.find(
      (item: any) => item?.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE",
    )?.value ?? 0,
  );

  const feeAmount = (price * feePercentage) / 100;

  let settlementAmount = 0;
  if (collectedBy === "BAP") {
    settlementAmount = price - feeAmount;
  } else if (collectedBy === "BPP") {
    settlementAmount = feeAmount;
  } else {
    settlementAmount = price;
  }

  const settlementTermsTag = tags?.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  const settlementAmountItem = settlementTermsTag?.list?.find(
    (item: any) => item?.descriptor?.code === "SETTLEMENT_AMOUNT",
  );

  if (settlementAmountItem) {
    settlementAmountItem.value = settlementAmount.toString();
  }
  return existingPayload;
}
