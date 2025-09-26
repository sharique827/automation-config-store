export async function select_2_DefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.message.order.provider.id =
    sessionData?.on_select_1_provider_id ?? "P1";

  //******************************************************* */

  // const fulfillments = sessionData?.on_select_1_fulfillments?.map(
  //   (item: any) => {
  //     if (item.type === "TICKET") {
  //       const seatGrid = item.tags.find(
  //         (t: any) => t.descriptor?.code === "SEAT_GRID"
  //       );

  //       const seatNumber = seatGrid?.list.find(
  //         (l: any) => l.descriptor?.code === "SEAT_NUMBER"
  //       )?.value;

  //       const seatPrice = seatGrid?.list.find(
  //         (l: any) => l.descriptor?.code === "SEAT_PRICE"
  //       )?.value;

  //       return {
  //         id: item.id,
  //         tags: [
  //           {
  //             descriptor: { code: "SEAT_GRID" },
  //             list: [
  //               { descriptor: { code: "NUMBER" }, value: seatNumber },
  //               { descriptor: { code: "SELECTED" }, value: "true" },
  //               { descriptor: { code: "SEAT_PRICE" }, value: seatPrice },
  //             ],
  //           },
  //         ],
  //       };
  //     } else {
  //       const { id, stops, vehicle, tags } = item;
  //       const simplifiedStops = stops.map((stop: any) => ({ id: stop.id }));

  //       const tag = tags.filter((i: any) => i.descriptor.code === "INFO");
  //       return { id, stops: simplifiedStops, vehicle, tags: tag };
  //     }
  //   }
  // );

  let isSeat = true;

  const isSeatSelected =
    sessionData?.on_select_1_items?.filter((i: any) => i?.parent_item_id) || [];

  let items: any[] = [];

  if (isSeatSelected.length > 0) {
    items = isSeatSelected.map((item: any) => {
      const { id, parent_item_id, quantity, add_ons } = item;
      const addOns =
        add_ons?.map((i: any) => ({
          id: i.id,
          quantity: i.quantity,
        })) || [];

      return { id, parent_item_id, quantity, add_ons: addOns };
    });
  } else {
    isSeat = false;
    items =
      sessionData?.on_select_1_items?.map((item: any) => ({
        id: item.id ?? "",
        parent_item_id: item.id ?? "",
        quantity: item.quantity ?? {},
      })) || [];
  }

  // const items =
  //   sessionData?.on_select_1_items?.map((item: any) => {
  //     if (item?.parent_item_id) {
  //       const { id, parent_item_id, quantity, add_ons } = item;
  //       const addOns =
  //         add_ons?.map((i: any) => ({
  //           id: i.id,
  //           quantity: i.quantity,
  //         })) || [];

  //       return { id, parent_item_id, quantity, add_ons: addOns };
  //     } else {
  //       return {
  //         id: item.id ?? "",
  //         parent_item_id: item.id ?? "",
  //         quantity: item.quantity ?? {},
  //       };
  //     }
  //   }) || [];

  // const items = sessionData?.on_select_1_items?.map((item: any) => {
  //   if (item?.parent_item_id) {
  //     const { id, parent_item_id, quantity, add_ons } = item;
  //     const addOns = add_ons?.map((i: any) => {
  //       return { id: i.id, quantity: i.quantity };
  //     });
  //     return { id, parent_item_id, quantity, add_ons: addOns };
  //   }
  //   // else {
  //   //   const { id, quantity } = item;
  //   //   return {
  //   //     id,
  //   //     // parent_item_id: id.split("-")[0],
  //   //     quantity,
  //   //   };
  //   // }
  // });

  existingPayload.message.order.items = items;

  const tripFulfillment = sessionData?.on_select_1_fulfillments?.filter(
    (item: any) => item.type === "TRIP"
  );
  const ticketFulfillment = sessionData?.on_select_1_fulfillments?.filter(
    (item: any) => item.type === "TICKET"
  );

  let mappedFulfillments = [] as any[];
  if (isSeat) {
    mappedFulfillments = existingPayload.message.order.items.map(
      (_i: any, index: number) => {
        return ticketFulfillment[index];
      }
    );
  } else {
    let totalCount = 0;
    existingPayload.message.order.items.map((_i: any, index: number) => {
      totalCount = totalCount + Number(_i.quantity?.selected?.count || 1);
    });
    for (let i = 0; i < totalCount; i++) {
      mappedFulfillments.push(ticketFulfillment[i]);
    }
  }

  const fulfillment = [...tripFulfillment, ...mappedFulfillments];

  const fulfillments = fulfillment?.map((item: any) => {
    if (isSeat) {
      if (item.type === "TICKET") {
        const seatGrid = item.tags.find(
          (t: any) => t.descriptor?.code === "SEAT_GRID"
        );

        const seatNumber = seatGrid?.list.find(
          (l: any) => l.descriptor?.code === "SEAT_NUMBER"
        )?.value;

        const seatPrice = seatGrid?.list.find(
          (l: any) => l.descriptor?.code === "SEAT_PRICE"
        )?.value;

        return {
          id: item.id,
          tags: [
            {
              descriptor: { code: "SEAT_GRID" },
              list: [
                { descriptor: { code: "NUMBER" }, value: seatNumber },
                { descriptor: { code: "SELECTED" }, value: "true" },
                { descriptor: { code: "SEAT_PRICE" }, value: seatPrice },
              ],
            },
          ],
        };
      } else {
        const { id, stops, vehicle, tags } = item;
        const simplifiedStops = stops.map((stop: any) => ({ id: stop.id }));

        const tag = tags.filter((i: any) => i.descriptor.code === "INFO");
        return { id, stops: simplifiedStops, vehicle, tags: tag };
      }
    } else {
      if (item.type === "TICKET") {
        const seatGrid = item.tags.find(
          (t: any) => t.descriptor?.code === "SEAT_GRID"
        );

        const seatNumber = seatGrid?.list.find(
          (l: any) => l.descriptor?.code === "SEAT_NUMBER"
        )?.value;

        const seatPrice = seatGrid?.list.find(
          (l: any) => l.descriptor?.code === "SEAT_PRICE"
        )?.value;

        return {
          id: item.id,
          // tags: [
          //   {
          //     descriptor: { code: "SEAT_GRID" },
          //     list: [
          //       { descriptor: { code: "NUMBER" }, value: seatNumber },
          //       { descriptor: { code: "SELECTED" }, value: "true" },
          //       { descriptor: { code: "SEAT_PRICE" }, value: seatPrice },
          //     ],
          //   },
          // ],
        };
      } else {
        const { id, stops, vehicle, tags } = item;
        const simplifiedStops = stops.map((stop: any) => ({ id: stop.id }));

        const tag = tags.filter((i: any) => i.descriptor.code === "INFO");
        return { id, stops: simplifiedStops, vehicle, tags: tag };
      }
    }
  });

  existingPayload.message.order.items = items;
  existingPayload.message.order.fulfillments = fulfillments;

  return existingPayload;
}
