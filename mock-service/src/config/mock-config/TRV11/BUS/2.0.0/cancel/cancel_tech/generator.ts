import { SessionData } from "../../../../session-types";

export async function cancelTechGenerator(existingPayload: any,sessionData: SessionData){
    if (sessionData.order_id) {
        existingPayload.message.order_id = sessionData.order_id;
      }
    return existingPayload;
}