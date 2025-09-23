const getRandomItemsWithQuantities = (items: any): any => {
	// Shuffle the array to select random items
	const shuffledItems = items.sort(() => Math.random() - 0.5);

	// Determine a random number of items to pick
	const randomItemCount = Math.floor(Math.random() * items.length) + 1;

	// Pick a random subset of items
	const selectedItems = shuffledItems.slice(0, randomItemCount);

	// Assign random quantities within the minimum and maximum range
	return selectedItems.map((item: any) => {
		const min = item.quantity.minimum.count;
		const max = item.quantity.maximum.count;

		return {
			id: item.id,
			quantity: {
				selected: {
					count: Math.floor(Math.random() * (max - min + 1)) + min, // Random number between min and max (inclusive)
				},
			},
		};
	});
};

const transformToItemFormat = (items: any[]): any => {
	try {
		return items.map((item) => ({
			id: item.id,
			quantity: {
				maximum: {
					count: item.quantity.maximum.count,
				},
				minimum: {
					count: item.quantity.minimum.count,
				},
			},
		}));
	} catch (e: any) {
		console.error(e.message);
	}
};
export async function selectGenerator(existingPayload: any, sessionData: any) {
// Note: commits should be uncommits
	// const items = sessionData?.items;
	// const items_min_max = transformToItemFormat(items);
	// const chosen_items = getRandomItemsWithQuantities(items_min_max);
	// sessionData.selected_ids = Array.isArray(sessionData.selected_ids)
	// 	? sessionData.selected_ids
	// 	: [sessionData.selected_ids];
	// const items_chosen = chosen_items;
	// if(items_chosen){
	// 	existingPayload.message.order.items = items_chosen;
	// }
	// if(sessionData.provider_id){
	// 	existingPayload.message.order.provider.id = sessionData.provider_id
	//   }
	//   const chosenItemsIds = chosen_items.map((item:any) => item.id);
	//   const filteredItems = sessionData.items.filter((item:any) => 
	// 	chosenItemsIds.includes(item.id)
	//   );
	//   const uniqueFulfillmentIds = [
	// 	...new Set(
	// 		filteredItems.flatMap((item:any) => item.fulfillment_ids || [])
	// 	)
	//   ];
	//   const formattedFulfillmentIds = uniqueFulfillmentIds.map(id => ({ id }));
	//   console.log("select formatted_fulfil",sessionData.buyer_side_fulfillment_ids)
	//   existingPayload.message.order.fulfillments = formattedFulfillmentIds
	return existingPayload;
}
