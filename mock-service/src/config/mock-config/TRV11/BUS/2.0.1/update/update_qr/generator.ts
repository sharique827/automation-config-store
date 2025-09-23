import { SessionData } from "../../../../session-types";

function injectTicketFulfillments(payload: any, sessionData: SessionData) {
    const ticketFulfillments =
      sessionData.fulfillments?.filter((f: any) => f?.type === "TRIP") || [];
  
    payload.message.order.fulfillments = ticketFulfillments.map((f: any, idx: number) => ({
      id: f.id,
      stops: [
        {
          authorization: {
            status: "CLAIMED"
          }
        }
      ]
    }));
  
    return payload;
  }
  
export async function updateQrGenerator(existingPayload: any,sessionData: any){
    if(sessionData.order_id){
        existingPayload.message.order.id = sessionData.order_id
    }
    existingPayload = injectTicketFulfillments(existingPayload,sessionData)
    return existingPayload;
}
