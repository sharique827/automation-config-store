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

import type { MockAction } from "./classes/mock-action";

// types/helpers
type Ctor<T> = new () => T;

// === keep your imports exactly as they are ===

// Build a single source of truth registry
const registry = {
	// search
	search: MockSearchClass,

	// on_search
	on_search: MockOnSearchClass,

	// select
	select: MockSelectClass,
	on_select: MockOnSelectClass,

	// init / on_init
	init: MockInitClass,
	on_init: MockOnInitClass,

	// confirm / on_confirm
	confirm: MockConfirmClass,
	confirm_card_balance_success: MockConfirmSuccessClass,
	confirm_card_balance_faliure: MockConfirmFaliureClass,

	on_confirm: MockOnConfirmDefaultClass,
	on_confirm_card_balance_success: MockOnConfirmSuccessDefaultClass,
	on_confirm_card_balance_faliure: MockOnConfirmFaliureDefaultClass,

} as const satisfies Record<string, Ctor<MockAction>>;

type MockActionId = keyof typeof registry;

// Construct by id
export function getMockAction(actionId: string): MockAction {
	const Ctor = registry[actionId as MockActionId];
	if (!Ctor) {
		throw new Error(`Action with ID ${actionId as string} not found`);
	}
	return new Ctor();
}

// List all possible ids — stays in sync automatically
export function listMockActions(): MockActionId[] {
	return Object.keys(registry) as MockActionId[];
}
