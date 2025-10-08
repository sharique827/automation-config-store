export async function onRatingGenerator(
  existingPayload: any,
  sessionData: any
) {
  const { context, message } = existingPayload;

  return {
    context,
    error: {
      code: "90203",
      message: "The buyer app provides the invalid order_id",
    },
  };

  // return existingPayload;
}
