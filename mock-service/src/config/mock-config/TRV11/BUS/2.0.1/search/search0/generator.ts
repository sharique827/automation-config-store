import { SessionData } from "../../../../session-types";

export async function search0Generator(
  existingPayload: any,
  sessionData: SessionData
) { 
  delete existingPayload.context.bpp_id
  delete existingPayload.context.bpp_uri
  return existingPayload;
}
