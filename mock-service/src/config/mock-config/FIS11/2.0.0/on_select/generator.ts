/**
 * On_Select Generator for TRV14
 *
 * Logic:
 * 1. Filter items from sessionData.items based on sessionData.selected_items
 * 2. Merge selected quantities from selected_items into full item details
 * 3. Calculate quote breakup (BASE_FARE, ADD_ONS, TAX=0) - excluding parent items
 * 4. Handle fulfillments from session data
 *
 * demonstration purposes but excluded from price calculations
 */

/**
 * Merges add-on selection data with full add-on details
 * @param fullAddOns - Complete add-on details from sessionData.items
 * @param selectedAddOns - Selection data from sessionData.selected_items
 * @returns Merged add-ons with selection quantities
 */
function mergeAddOnsWithSelection(
  fullAddOns: any[],
  selectedAddOns: any[]
): any[] {
  return fullAddOns.map((fullAddOn: any) => {
    // Find matching selected add-on by id
    const selectedAddOn = selectedAddOns.find(
      (selected: any) => selected.id === fullAddOn.id
    );

    if (selectedAddOn) {
      // Merge full add-on details with selected quantities
      return {
        ...fullAddOn,
      };
    }

    // Return full add-on without selection if not found in selected
    return fullAddOn;
  });
}

/**
 * Creates item payload by merging full item details with selection data
 * @param fullItem - Complete item from sessionData.items
 * @param selectedItem - Selection data from sessionData.selected_items
 * @returns Merged item payload with selection quantities
 */
function createItemWithSelection(fullItem: any, selectedItem: any): any {
  const itemPayload = { ...fullItem };

  // Handle add-ons - merge selected quantities from selectedItem.add_ons
  if (selectedItem.add_ons && fullItem.add_ons) {
    itemPayload.add_ons = mergeAddOnsWithSelection(
      fullItem.add_ons,
      selectedItem.add_ons
    );
  }

  return itemPayload;
}

/**
 * Calculates quote breakup for selected items
 * @param items - Array of items with selection data
 * @returns Quote object with breakup and total price
 */
function calculateQuote(items: any[]): any {
  const breakup: any[] = [];
  let totalValue = 0;

  const priceableItems = items.filter(
    (item: any) => item.price && item.price.value
  );

  // Calculate BASE_FARE for each priceable item (excluding parent items)
  priceableItems.forEach((item: any) => {
    const itemPrice = parseFloat(item.price.value);
    const itemTotal = itemPrice;

    breakup.push({
      title: "BASE_FARE",
      item: {
        id: item.id,
        price: {
          currency: item.price.currency,
          value: item.price.value,
        },
      },
      price: {
        currency: item.price.currency,
        value: itemTotal.toString(),
      },
    });
    totalValue += itemTotal;
  });

  // Add TAX (fixed 0 for now)
  breakup.push({
    title: "TAX",
    price: {
      currency: "INR",
      value: "0",
    },
  });

  return {
    id: "Q1",
    breakup,
    price: {
      currency: "INR",
      value: totalValue.toString(),
    },
  };
}

export async function onSelectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  // Note: Validation is handled in meetRequirements method of the class

  // Filter and merge items based on selected_items
  const responseItems: any[] = [];
  const addedParentIds: Set<string> = new Set(); // Track added parent items to avoid duplicates

  sessionData.selected_items.forEach((selectedItem: any) => {
    // Find the full item details from sessionData.items
    const fullItem = sessionData.items.find(
      (item: any) => item.id === selectedItem.id
    );

    if (fullItem) {
      // If selected item has a parent_item_id, include the parent item first (for demonstration)
      if (
        fullItem.parent_item_id &&
        !addedParentIds.has(fullItem.parent_item_id)
      ) {
        const parentItem = sessionData.items.find(
          (item: any) => item.id === fullItem.parent_item_id
        );
        if (parentItem) {
          const parentItemCopy = { ...parentItem };

          // Clean up parent item
          delete parentItemCopy.cancellation_terms;
          delete parentItemCopy.replacement_terms;

          responseItems.push(parentItemCopy);
          addedParentIds.add(fullItem.parent_item_id);
        }
      }

      // Clean up selected item
      delete fullItem.cancellation_terms;
      delete fullItem.replacement_terms;

      const mergedItem = createItemWithSelection(fullItem, selectedItem);
      responseItems.push(mergedItem);
    }
  });

  // Update payload with filtered items
  existingPayload.message.order.items = responseItems;

  // Calculate and set quote
  existingPayload.message.order.quote = calculateQuote(responseItems);

  // Set fulfillments from session data if available and add agent data
  // if (sessionData.fulfillments) {

  //   existingPayload.message.order.fulfillments =
  //     sessionData.fulfillments?.filter(
  //       (fulfillment: any) =>
  //         fulfillment.id === sessionData.selected_fulfillments[0].id
  //     );
  // }

  if (sessionData.fulfillments) {
    const selectedFulfillments = sessionData.fulfillments?.filter(
      (fulfillment: any) =>
        fulfillment.id === sessionData.selected_fulfillments[0].id
    );

    if (selectedFulfillments?.length) {
      // merge customer from old payload (if exists)
      const oldFulfillment = existingPayload.message.order.fulfillments?.find(
        (f: any) => f.id === selectedFulfillments[0].id
      );

      if (oldFulfillment?.customer) {
        selectedFulfillments[0] = {
          ...selectedFulfillments[0],
          customer: oldFulfillment.customer,
        };
      }

      existingPayload.message.order.fulfillments = selectedFulfillments;
    }
  }

  // add xinput to child items (items with parent_item_id)
  if (
    existingPayload.message.order.items &&
    Array.isArray(existingPayload.message.order.items)
  ) {
    existingPayload.message.order.items.forEach((item: any) => {
      item.price = {
        value: item.price.value,
      };
      // Only add xinput to child items (items with parent_item_id)
      if (item.parent_item_id) {
        item.xinput = {
          head: {
            descriptor: {
              name: "Additional Details",
            },
            index: {
              min: 0,
              cur: 0,
              max: 0,
            },
            headings: ["ADDITIONAL_DETAILS"],
          },
          form: {
            id: "F01",
            mime_type: "text/html",
            url: "https://api.unreserved-entry-pass.com/xinput/additonal-details/F01",
            resubmit: false,
            multiple_sumbissions: false,
          },
          required: true,
        };
      }
    });
  }

  return existingPayload;
}
