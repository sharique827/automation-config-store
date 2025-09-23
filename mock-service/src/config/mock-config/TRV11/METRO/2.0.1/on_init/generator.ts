import { SessionData } from "../../../session-types";

const generateRandomId = () => {
	return Math.random().toString(36).substring(2, 15);
  };
const transformPayments = (payments:any) => {
return payments.map((payment:any) => {
	return {
		id: generateRandomId(),
		collected_by: payment.collected_by,
		status: "NOT-PAID",
		type: "PRE-ORDER",
		params: {
			bank_code: "XXXXXXXX",
			bank_account_number: "xxxxxxxxxxxxxx",
		},
		tags: payment.tags,
		};
	});
};
export async function onInitGenerator(
	existingPayload: any,
	sessionData: SessionData
) {
	const payments = transformPayments(sessionData.payments)
	existingPayload.message.order.payments = payments;
	if (sessionData.items.length > 0) {
		existingPayload.message.order.items = sessionData.items;
	}
	if (sessionData.fulfillments.length > 0) {
	existingPayload.message.order.fulfillments = sessionData.fulfillments;
	}
	if(sessionData.quote != null){
	existingPayload.message.order.quote = sessionData.quote
	}
	return existingPayload;
}
