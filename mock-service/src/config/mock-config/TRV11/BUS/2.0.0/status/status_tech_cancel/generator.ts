

export async function statusTechCancelGenerator(existingPayload: any,sessionData: any){
    if(sessionData.ref_id){
        existingPayload.message.ref_id = sessionData.ref_id
    }
    return existingPayload;
}