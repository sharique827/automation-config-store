import { randomBytes } from "crypto";
import { SessionData } from "../../../../session-types";

function generateQrToken(): string {
    return randomBytes(32).toString("base64");
}
function updateOrderTimestamps(payload: any) {
    const now = new Date().toISOString();
    if (payload.message.order) {
      payload.message.order.created_at = now;
      payload.message.order.updated_at = now;
    }
    return payload;
  }

function updateFulfillmentsWithParentInfo(fulfillments: any[]): void {
    const validTo = "2024-07-23T23:59:59.999Z";

    fulfillments.forEach((fulfillment) => {
        // Generate a random QR token
        const qrToken = generateQrToken();

        // Ensure stops array exists
        fulfillment.stops = fulfillment.stops || [];

        // If a stop exists, modify the first stop; otherwise, create a new one
        if (fulfillment.stops.length > 0) {
            fulfillment.stops[0].authorization = {
                type: "QR",
                token: qrToken,
                valid_to: validTo,
                status: "UNCLAIMED",
            };
        } else {
            fulfillment.stops.push({
                type: "START",
                authorization: {
                    type: "QR",
                    token: qrToken,
                    valid_to: validTo,
                    status: "UNCLAIMED",
                },
            });
        }

        // Generate a random ticket number
        const ticketNumber = Math.random().toString(36).substring(2, 10);

        // Ensure tags array exists
        fulfillment.tags = fulfillment.tags || [];

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