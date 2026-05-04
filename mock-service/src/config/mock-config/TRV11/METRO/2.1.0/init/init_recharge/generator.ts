export async function initRechargeGenerator(
  existingPayload: any,
  sessionData: any,
) {
  existingPayload.context.location.city.code =
    sessionData?.select_city_code ?? "std:080";
  const metroRechargeFulfillment = sessionData?.fulfillments
    ?.flat()
    .find((fulfillment: any) => {
      return fulfillment.type === "ONLINE";
    });
  existingPayload.message.order.provider.id =
    sessionData?.select_unlimited_pass_provider_id ?? "Provider1";
  existingPayload.message.order.items = [
    {
      id: sessionData?.selected_items?.[0]?.id ?? "itemid",
    },
  ];
  existingPayload.message.order.fulfillments = [
    {
      id: metroRechargeFulfillment?.id ?? "Fulfillment2",
      customer: {
        contact: {
          email: "joe.adam@abc.org",
          phone: "+91-9999999999",
        },
        person: {
          creds: metroRechargeFulfillment?.customer?.person?.creds ?? [],
          name: "Joe Adam",
        },
      },
      type: metroRechargeFulfillment?.type ?? "ONLINE",
    },
  ];
  existingPayload.message.order.payments[0].collected_by =
    sessionData?.user_inputs?.collected_by;
  return existingPayload;
}
