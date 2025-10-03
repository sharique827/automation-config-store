import { SessionData } from "../../../../session-types";
import { on_search_default } from "../../on_search/default";

export async function onSelect_1_DefaultGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.message.order.provider.id =
    sessionData.select_1_provider_id ?? "P1";
  existingPayload.message.order.provider.descriptor =
    on_search_default?.message.catalog.descriptor ?? {};
  let count = 1;

  let items: any = on_search_default?.message.catalog.providers[0]?.items || [];
  items = items?.map((it: any) => {
    return {
      ...it,
      tags: it.tags.filter((i: any) => i.descriptor.code !== "FARE_BREAK_UP"),
    };
  });

  const on_select_item = sessionData?.select_1_items.map((item: any) => {
    const data = items.find(
      (i: any) => i.id === (item?.parent_item_id || item?.id)
    );
    if (!data) return null;

    const { add_ons, cancellation_terms, ...rest } = data;

    let selectedAddOns: any[] | undefined;

    if (item?.add_ons && add_ons) {
      const itemAddOnIds = item.add_ons.map((x: any) =>
        typeof x === "string" ? x : x.id
      );
      selectedAddOns = add_ons.filter((a: any) => itemAddOnIds.includes(a.id));
    }

    const result: any = {
      ...rest,
      quantity: item?.quantity ?? 1,
    };

    // Only attach add_ons, parent_item_id, and id if add_ons exist
    if (selectedAddOns && selectedAddOns.length > 0) {
      const parentId = item?.parent_item_id || item?.id;
      result.add_ons = selectedAddOns;
      result.parent_item_id = parentId;
      result.id = `${parentId}-${count}`;
      count++;
    }

    return result;
  });

  existingPayload.message.order.items = on_select_item;

  const selectedFulfillmentIds =
    sessionData?.select_1_fulfillments?.map((f: any) => f.id) || [];

  const baseFulfillments =
    on_search_default?.message?.catalog?.providers[0]?.fulfillments.filter(
      (ful: any) => selectedFulfillmentIds.includes(ful.id)
    ) || [];

  existingPayload.message.order.fulfillments = baseFulfillments;

  const baseItems =
    existingPayload?.message?.order?.items?.filter(
      (i: any) => !i.parent_item_id
    ) || [];

  const counts = baseItems.reduce(
    (sum: number, i: any) => sum + Number(i?.quantity?.selected?.count || 0),
    0
  );

  const extraFulfillments = Array.from({ length: counts }, (_, index) => ({
    id: `FT-${index + 1}`,
    type: "TICKET",
    tags: [
      {
        descriptor: { code: "SEAT_GRID" },
        list: [
          { descriptor: { code: "X" }, value: "0" },
          { descriptor: { code: "Y" }, value: "0" },
          { descriptor: { code: "Z" }, value: "0" },
          { descriptor: { code: "SEAT_NUMBER" }, value: `A${index + 1}` },
          { descriptor: { code: "AVAILABLE" }, value: "true" },
          { descriptor: { code: "SEAT_PRICE" }, value: "200" },
        ],
      },
    ],
  }));

  existingPayload.message.order.fulfillments = [
    ...baseFulfillments?.map((ful: any) => {
      return {
        ...ful,
        tags: [
          ...ful.tags,
          {
            descriptor: {
              code: "VEHICLE_GRID",
            },
            display: false,
            list: [
              {
                descriptor: {
                  code: "X_MAX",
                },
                value: "14",
              },
              {
                descriptor: {
                  code: "Y_MAX",
                },
                value: "3",
              },
              {
                descriptor: {
                  code: "Z_MAX",
                },
                value: "1",
              },
              {
                descriptor: {
                  code: "X_LOBBY_START",
                },
                value: "0",
              },
              {
                descriptor: {
                  code: "X_LOBBY_SIZE",
                },
                value: "12",
              },
              {
                descriptor: {
                  code: "Y_LOBBY_START",
                },
                value: "1",
              },
              {
                descriptor: {
                  code: "Y_LOBBY_SIZE",
                },
                value: "1",
              },
              {
                descriptor: {
                  code: "SEAT_SELECTION",
                },
                value: "mandatory",
              },
            ],
          },
          {
            descriptor: {
              code: "VEHICLE_AVAIBALITY",
            },
            display: false,
            list: [
              {
                descriptor: {
                  code: "AVALIABLE_SEATS",
                },
                value: "20",
              },
            ],
          },
        ],
      };
    }),
    ...extraFulfillments,
  ];

  const getFulfillmentId =
    existingPayload?.message?.order?.fulfillments?.filter((i: any) => {
      return i.id.includes("-");
    });

  let index = 0;

  const filteredItem = existingPayload?.message?.order?.items?.map((i: any) => {
    if (i.parent_item_id) {
      const updatedItem = {
        ...i,
        fulfillment_ids: [
          ...(i.fulfillment_ids || []),
          ...(getFulfillmentId?.[index]?.id
            ? [getFulfillmentId[index].id]
            : []),
        ],
      };
      index++;
      return updatedItem;
    } else {
      return i;
    }
  });

  existingPayload.message.order.items = filteredItem;
  return existingPayload;
}
