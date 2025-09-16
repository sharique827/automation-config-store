import { MockSearchClass } from "./2.0.0/search/class";
import { MockOnSearchClass } from "./2.0.0/on_search/class";
import { MockSelectClass } from "./2.0.0/select/class";
import { MockOnSelectClass } from "./2.0.0/on_select/class";
import { MockInitClass } from "./2.0.0/init/class";
import { MockOnInitClass } from "./2.0.0/on_init/class";
import { MockConfirmClass } from "./2.0.0/confirm/class";
import { MockOnConfirmDefaultClass } from "./2.0.0/on_confirm/class";
import { MockConfirmSuccessClass } from "./2.0.0/confirm/confirm_card_balance_success/class";
import { MockConfirmFaliureClass } from "./2.0.0/confirm/confirm_card_balance_faliure/class";
import { MockOnConfirmSuccessDefaultClass } from "./2.0.0/on_confirm/on_confirm_card_balance_success/class";
import { MockOnConfirmFaliureDefaultClass } from "./2.0.0/on_confirm/on_confirm_card_balance_faliure/class";
import { MockAction } from "./classes/mock-action";

type Ctor<T> = new () => T;

const registry = {
  search: MockSearchClass,
  on_search: MockOnSearchClass,
  select: MockSelectClass,
  on_select: MockOnSelectClass,
  init: MockInitClass,
  on_init: MockOnInitClass,
  confirm: MockConfirmClass,
  confirm_card_balance_success: MockConfirmSuccessClass,
  confirm_card_balance_faliure: MockConfirmFaliureClass,
  on_confirm: MockOnConfirmDefaultClass,
  on_confirm_card_balance_success: MockOnConfirmSuccessDefaultClass,
  on_confirm_card_balance_faliure: MockOnConfirmFaliureDefaultClass,
} as const satisfies Record<string, Ctor<MockAction>>;

export function getFIS11MockAction(actionId: string): MockAction {
  const Ctor = registry[actionId as keyof typeof registry];
  if (!Ctor) {
    throw new Error(`Action with ID ${actionId} not found`);
  }
  return new Ctor();
}

export function listFIS11MockActions(): (keyof typeof registry)[] {
  return Object.keys(registry) as (keyof typeof registry)[];
}

// Keep backward compatibility
export function getMockAction(actionId: string) {
  return getFIS11MockAction(actionId);
}
