export async function onSelect_2_DefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.message.order.provider = sessionData?.on_select_1_provider;

  const items = sessionData?.select_2_items.map((i: any) => {
    return (sessionData?.on_select_1_items || []).find(
      (f: any) => f.id === i.id
    );
  });

  const data = sessionData?.on_select_1_items?.filter(
    (item: any) => !item.parent_item_id
  );

  const isParentItem =
    sessionData?.select_2_items?.some((i: any) => i.id === i.parent_item_id) ||
    false;

  if (isParentItem) {
    existingPayload.message.order.items = [...data];
  } else {
    existingPayload.message.order.items = [...data, ...items];
  }
  // existingPayload.message.order.items = [...data, ...items];

  const fulfillment = (sessionData?.select_2_fulfillments || []).map(
    (i: any) => {
      return (sessionData?.on_select_1_fulfillments || []).find(
        (f: any) => f.id === i.id
      );
    }
  );

  function getUnselected(onSelect: any[], selected: any[]) {
    const selectedIds = new Set(selected.map((o) => o.id));
    return onSelect.filter((o) => !selectedIds.has(o.id));
  }
  const result = getUnselected(
    sessionData?.on_select_1_fulfillments,
    sessionData?.select_2_fulfillments
  );

  console.log(result);

  const fulfillments = fulfillment.map((item: any) => {
    if (item.type === "TICKET") {
      return {
        ...item,
        tags: item.tags.map((tag: any) => {
          if (tag.descriptor?.code === "SEAT_GRID") {
            const seatNumber = tag.list.find(
              (l: any) => l.descriptor?.code === "SEAT_NUMBER"
            )?.value;

            return {
              ...tag,
              list: tag.list.map((l: any) => {
                if (l.descriptor?.code === "AVAILABLE") {
                  return {
                    ...l,
                    descriptor: { code: "SELECTED_SEAT" },
                    value: seatNumber || "UNKNOWN",
                  };
                }
                return l;
              }),
            };
          }
          return tag;
        }),
      };
    } else {
      return {
        ...item,
        tags: (item.tags || []).filter(
          (t: any) => t.descriptor?.code === "INFO"
        ),
      };
    }
  });

  // const fulfillments = sessionData?.on_select_1_fulfillments?.map(
  //   (item: any) => {
  //     if (item?.id?.includes("-")) {
  //       return item;
  //     } else {
  //       return {
  //         ...item,
  //         tags: item.tags.filter((i: any) => i.descriptor.code === "INFO"),
  //       };
  //     }
  //   }
  // );

  const restFulfillment = result.map((i) => {
    const { id, type } = i;
    return {
      id,
      type,
    };
  });

  if (isParentItem) {
    const fulfillment =
      sessionData?.select_2_fulfillments?.map((i: any) => {
        return (sessionData?.on_select_1_fulfillments || []).find(
          (f: any) => f.id === i.id
        );
      }) || [];
    const fulfillments = fulfillment
      .map((item: any) => {
        if (item.type === "TRIP") {
          const tags =
            item.tags?.filter((t: any) => t.descriptor?.code === "INFO") || [];
          return { ...item, tags };
        } else {
          const { id, type } = item;
          return { id, type };
        }
      });

    existingPayload.message.order.fulfillments = fulfillments;
  } else {
    existingPayload.message.order.fulfillments = [
      ...fulfillments,
      ...restFulfillment,
    ];
  }
  return existingPayload;
}
