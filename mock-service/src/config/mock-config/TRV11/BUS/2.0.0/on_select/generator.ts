import { SessionData } from "../../../session-types";

const createQuoteFromItems = (items: any): any => {
	let totalPrice = 0;
	const currency = items[0]?.price.currency || "INR";

	const breakup = items.map((item: any) => {
		const itemTotalPrice =
			Number(item.price.value) * item.quantity.selected.count;
		totalPrice += itemTotalPrice;

		return {
			title: "BASE_FARE",
			item: {
				id: item.id,
				price: {
					currency,
					value: item.price.value,
				},
				quantity: {
					selected: {
						count: item.quantity.selected.count,
					},
				},
			},
			price: {
				currency,
				value: itemTotalPrice.toFixed(2),
			},
		};
	});

	// Add OFFER and TOLL to breakup
	breakup.push(
		{
			title: "OFFER",
			price: {
				currency,
				value: "0",
			},
		},
		{
			title: "TOLL",
			price: {
				currency,
				value: "0",
			},
		}
	);

	return {
		price: {
			value: totalPrice.toFixed(2),
			currency,
		},
		breakup,
	};
};

function createAndAppendFulfillments(items: any[], fulfillments: any[]): void {
    items.forEach((item) => {
        item.fulfillment_ids.forEach((parentFulfillmentId: string) => {
            // Get the parent fulfillment object from the fulfillments array
            const parentFulfillment = fulfillments.find(
                (f) => f.id === parentFulfillmentId
            );

            if (parentFulfillment) {
                // Get the quantity based on the selected count
                const quantity = item.quantity.selected.count;

                for (let i = 0; i < quantity; i++) {
                    // Create a deep copy of the parent fulfillment
                    const newFulfillment = {
                        ...structuredClone(parentFulfillment), // Deep copy to avoid mutations
                        id: `F${Math.random().toString(36).substring(2, 9)}`, // Unique ID for new fulfillment
                    };

                    // Append the new fulfillment to the fulfillments array
                    fulfillments.push(newFulfillment);

                    // Append the new fulfillment's id to the item's fulfillment_ids
                    item.fulfillment_ids.push(newFulfillment.id);
                }
            }
        });
        item.fulfillment_ids.shift()
    });
    fulfillments.shift()
}


function getUniqueFulfillmentIdsAndFilterFulfillments(
    items: any[],
    fulfillments: any[]
): any[] {
    if (!Array.isArray(fulfillments)) {
        fulfillments = fulfillments ? [fulfillments] : [];
    }
    // Step 1: Get all unique fulfillment IDs from the items
    const fulfillmentIds = items
        .flatMap((item) => item.fulfillment_ids) // Flatten the fulfillment_ids arrays
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    // Step 2: Filter the fulfillments based on the unique fulfillment IDs
    const filteredFulfillments = fulfillments.filter(
        (fulfillment) => fulfillmentIds.includes(fulfillment.id) // Check if fulfillment.id is in the unique fulfillmentIds list
    );
    return filteredFulfillments;
}

const filterItemsBySelectedIds = (
    items: any[],
    selectedIds: string | string[]
): any[] => {
    // Convert selectedIds to an array if it's a string
    const idsToFilter = Array.isArray(selectedIds) ? selectedIds : [selectedIds];

    // Filter the items array based on the presence of ids in selectedIds
    return items.filter((item) => idsToFilter.includes(item.id));
};

export async function onSelectGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    let items = filterItemsBySelectedIds(
        sessionData.items,
        sessionData.selected_item_ids
    );
    let fulfillments = getUniqueFulfillmentIdsAndFilterFulfillments(
        sessionData.items,
        sessionData.fulfillments
    );
    const ids_with_quantities = {
        items: sessionData.selected_items.reduce((acc: any, item: any) => {
            acc[item.id] = item.quantity.selected.count;
            return acc;
        }, {}),
    };
    const updatedItems = sessionData.items
    .map((item: any) => ({
        ...item,
        quantity: {
            selected: {
                count: ids_with_quantities["items"][item.id] ?? 0, // Default to 0 if not in the mapping
            },
        },
    })).filter((item) => item.quantity.selected.count > 0);

    items = updatedItems
    createAndAppendFulfillments(updatedItems, fulfillments);
    const quote = createQuoteFromItems(updatedItems);
    existingPayload.message.order.items = items;
    existingPayload.message.order.fulfillments = fulfillments; 
    existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
        if (fulfillment.type === "ROUTE") {
            fulfillment.type = "TRIP";
          }
    })
    existingPayload.message.order.quote = quote;
    return existingPayload;
}