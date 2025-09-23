import { randomBytes } from "crypto";
import { SessionData } from "../../../../session-types";

function generateQrToken(): string {
	return randomBytes(32).toString("base64");
}

function updateFulfillmentsWithParentInfo(fulfillments: any[]): void {
    const validTo = "2024-07-23T23:59:59.999Z";
  
    fulfillments.forEach((fulfillment) => {
      // Check if the fulfillment has a parent tag
      const parentTag = fulfillment.tags?.find(
        (tag: any) =>
          tag.descriptor?.code === "INFO" &&
          tag.list?.some(
            (item: any) => item.descriptor?.code === "PARENT_ID"
          )
      );
  
      if (parentTag) {
        // Generate a random QR token
        const qrToken = generateQrToken();
  
        // Add the stops object
        fulfillment.stops = [
          {
            type: "START",
            authorization: {
              type: "QR",
              token: qrToken,
              valid_to: validTo,
              status: "UNCLAIMED",
            },
          },
        ];
  
        // Generate a random ticket number
        const ticketNumber = Math.random().toString(36).substring(2, 10);
  
        // Add the new TICKET_INFO tag
        fulfillment.tags.push({
          descriptor: {
            code: "TICKET_INFO",
          },
          list: [
            {
              descriptor: {
                code: "NUMBER",
              },
              value: ticketNumber,
            },
          ],
        });
      }
    });
}

export async function onConfirmGenerator(
	existingPayload: any,
	sessionData: SessionData
) {
	const randomId = Math.random().toString(36).substring(2, 15);
	const order_id = randomId;
	sessionData["updated_payments"][0]["params"]["bank_code"] = "XXXXXXXX";
	sessionData["updated_payments"][0]["params"]["bank_account_number"] =
		"xxxxxxxxxxxxxx";
	const updated_payments = sessionData.updated_payments;
	if (!Array.isArray(sessionData.updated_payments)) {
		sessionData.updated_payments = [sessionData.updated_payments];
	}
	updateFulfillmentsWithParentInfo(sessionData.fulfillments);
	existingPayload.message.order.payments = updated_payments;
	existingPayload.message.order.payments[0].params.amount = sessionData.price
  existingPayload.message.order.payments[0].id = sessionData.payment_id
	  // Check if items is a non-empty array
	if (sessionData.items.length > 0) {
	existingPayload.message.order.items = sessionData.items;
	}

	// Check if fulfillments is a non-empty array
	if (sessionData.fulfillments.length > 0) {
	existingPayload.message.order.fulfillments = sessionData.fulfillments;
	}
	if(sessionData.quote != null){
	existingPayload.message.order.quote = sessionData.quote
	}
	existingPayload.message.order.id = order_id;
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = now
  existingPayload.message.order.updated_at = now 
	return existingPayload;
}
