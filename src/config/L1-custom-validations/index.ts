import { validationOutput } from "./types";
import { search } from "./apiTests/search";
import { onSearch } from "./apiTests/on_search";
import { init } from "./apiTests/init";
import { onInit } from "./apiTests/on_init";
import { confirm } from "./apiTests/confirm";
import { onConfirm } from "./apiTests/onConfirm";
import { cancel } from "./apiTests/cancel";

export async function performL1CustomValidations(
  payload: any,
  action: string,
  allErrors = false,
  externalData = {}
): Promise<validationOutput> {
  console.log("Performing custom L1 validations for action: " + action);

  switch (action) {
    case "search":
      return await search(payload);
    case "on_search":
      return await onSearch(payload);
    case "init":
      return await init(payload);
    case "on_init":
      return await onInit(payload);
    case "confirm":
      return await confirm(payload);
    case "on_confirm":
      return await onConfirm(payload);
    case "cancel":
      return await cancel(payload);
    default: // Fixed default case
      return [
        {
          valid: true,
          code: 200,
          description: "Custom validation passed", // description is optional
        },
      ];
  }
}
