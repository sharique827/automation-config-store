

export async function statusGenerator(existingPayload: any,sessionData: any){
    if(sessionData.transaction_id){
        existingPayload.message.ref_id = sessionData.transaction_id
    }
    return existingPayload;
}