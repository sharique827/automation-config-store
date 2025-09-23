function createItemPayload(userInputItem: any): any {
  const itemPayload: any = {
    quantity: {
      selected: {
        count: userInputItem.count || 1,
      },
    },
  };

  if (
    userInputItem.addOns &&
    Array.isArray(userInputItem.addOns) &&
    userInputItem.addOns.length > 0
  ) {
    // Only use parent_item_id when add-ons exist
    itemPayload.parent_item_id = userInputItem.itemId;

    // Add add-ons
    itemPayload.add_ons = userInputItem.addOns.map((addOnId: string) => ({
      id: addOnId,
      quantity: {
        selected: { count: 1 },
      },
    }));
  } else {
    // Use id only when no add-ons
    itemPayload.id = userInputItem.itemId;
  }

  return itemPayload;
}


export async function select_1_DefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  
  // delete existingPayload.context.bpp_uri;
  // delete existingPayload.context.bpp_id;
  const userInputs = sessionData.user_inputs;

  // Process all items from user_inputs
  const itemPayloads = userInputs.items.map((item: any) =>
    createItemPayload(item)
  );

  // Update the payload with all selected items
  existingPayload.message.order.items = itemPayloads;

  // Set provider ID from user_inputs
  existingPayload.message.order.provider.id = userInputs.provider;

  // Create fulfillment object with the selected fulfillment ID
  // const contextTimestamp =
  //   existingPayload.context?.timestamp || new Date().toISOString();

  existingPayload.message.order.fulfillments = [
    {
      id: userInputs.fulfillment,
      stops: [
        {
          id: "S1",
        },
        {
          id: "S2",
        },
      ],
    },
  ];

  return existingPayload;
}
