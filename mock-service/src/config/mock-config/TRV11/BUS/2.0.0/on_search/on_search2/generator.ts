import { SessionData } from "../../../../session-types";
import { createFullfillment } from "../fulfillment-generator";
function updatePaymentDetails(
	payload: any,
	sessionData: SessionData
  ) {
	const providers = payload?.message?.catalog?.providers || [];
  
	providers.forEach((provider: any) => {
	  const payments = provider?.payments || [];
  
	  payments.forEach((payment: any) => {
		// Update collected_by
		payment.collected_by = sessionData.collected_by;
  
		// Update BUYER_FINDER_FEES_PERCENTAGE in tags
		const buyerFinderTag = payment.tags?.find(
		  (tag: any) => tag.descriptor?.code === "BUYER_FINDER_FEES"
		);
  
		if (buyerFinderTag?.list) {
		  const feeEntry = buyerFinderTag.list.find(
			(item: any) => item.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE"
		  );
  
		  if (feeEntry) {
			feeEntry.value = sessionData.buyer_app_fee;
		  } else {
			// Add it if not present
			buyerFinderTag.list.push({
			  descriptor: { code: "BUYER_FINDER_FEES_PERCENTAGE" },
			  value: sessionData.buyer_app_fee
			});
		  }
		}
	  });
	});
  
	return payload;
  }
function getFulfillmentPath(route: any[], startCode: string, endCode: string) {
    // Find the correct fulfillment where startCode appears before endCode
    const fulfillment = route.find(f => {
        const stopCodes = f.stops.map((stop:any) => stop.location.descriptor.code);
        const startIndex = stopCodes.indexOf(startCode);
        const endIndex = stopCodes.indexOf(endCode);
        return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
    });

    if (!fulfillment) {
        throw new Error("No valid route found with the given start and end codes.");
    }

    // Extract the stops in the correct range
    const startIndex = fulfillment.stops.findIndex((stop:any) => stop.location.descriptor.code === startCode);
    const endIndex = fulfillment.stops.findIndex((stop:any) => stop.location.descriptor.code === endCode);

    // Clone fulfillment to avoid modifying the original object
    const updatedFulfillment = { ...fulfillment, stops: [...fulfillment.stops] };

    updatedFulfillment.stops = fulfillment.stops.slice(startIndex, endIndex + 1).map((stop:any, index:any, array:any) => ({
        ...stop,
        type: index === 0 ? "START" : index === array.length - 1 ? "END" : "INTERMEDIATE_STOP"
    }));
    const today = new Date().toISOString().split("T")[0];

    // Define the new operational time tags
    const operationalTags: any = {
        descriptor: { code: "ROUTE_INFO" },
        list: [
            {
                descriptor: { code: "OPERATIONAL_START_TIME" },
                value: `${today}T05:30:00.000Z`
            },
            {
                descriptor: { code: "OPERATIONAL_END_TIME" },
                value: `${today}T20:30:00.000Z`
            }
        ]
    };

    // Append operational time tags to existing tags
    updatedFulfillment.tags = updatedFulfillment.tags.map((tag:any) =>
        tag.descriptor.code === "ROUTE_INFO"
            ? { ...tag, list: [...tag.list, ...operationalTags.list] }
            : tag
    );
    return updatedFulfillment;
}

export async function onSearch2Generator(
    existingPayload: any,
    sessionData: SessionData
) {
    existingPayload = updatePaymentDetails(existingPayload,sessionData)
    try {
        const route = createFullfillment(
            sessionData.city_code ?? "std:011"
        ).fulfillments;
        const { start_code, end_code } = sessionData;
        if (!start_code || !end_code) {
            throw new Error("Start and End station codes are required");
        }
        const fulfillments = getFulfillmentPath(route, start_code, end_code);

        existingPayload.message.catalog.providers[0].fulfillments = [fulfillments];
        existingPayload.message.catalog.providers[0].items.forEach((item:any) => {
            item.fulfillment_ids = [fulfillments.id]
        })
        existingPayload.message.catalog.providers[0].fulfillments.forEach((fulfillment: any) => {
			if (fulfillment.type === "ROUTE") {
				fulfillment.type = "TRIP";
			  }
		})
        return existingPayload;

    } catch (err) {
        console.error(err);
        delete existingPayload.message;
        const errorMessage = {
            code: `91201`,
            message: "To & from location not serviceable by Mock Seller application",
        };
        existingPayload.error = errorMessage;
        return existingPayload;
    }
}