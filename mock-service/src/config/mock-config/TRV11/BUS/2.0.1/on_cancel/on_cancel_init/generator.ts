import { onCancelSoftGenerator } from "../on_cancel_soft/generator";
type Price = {
  value: string;
  currency: string;
};

type Item = {
  id: string;
  price: Price;
  quantity: {
    selected: {
      count: number;
    };
  };
};

type Breakup = {
  title: string;
  item?: Item;
  price: Price;
};

type Quote = {
  price: Price;
  breakup: Breakup[];
};
function stripTicketAuthorizations(order:any) {
    if (!order.fulfillments) return order;
  
    order.fulfillments = order.fulfillments.map((fulfillment:any) => {
      if (fulfillment.type === "TICKET") {
        return {
          ...fulfillment,
          stops: fulfillment.stops.map((stop:any) => {
            const { authorization, ...rest } = stop;
            return rest;
          })
        };
      }
      return fulfillment;
    });
  
    return order;
  }
export async function onCancelInitGenerator(existingPayload: any,sessionData: any){
    existingPayload = await onCancelSoftGenerator(existingPayload,sessionData)
	existingPayload.message.order.status = "CANCELLATION_INITIATED"
    existingPayload.message.order = stripTicketAuthorizations(existingPayload.message.order)
    const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at
    existingPayload.message.order.updated_at = now
    return existingPayload;
}