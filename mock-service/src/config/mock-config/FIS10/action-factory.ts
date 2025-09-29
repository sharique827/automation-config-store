import { MockSearchClass } from "./2.1.0/search/class";
import { MockOnSearchClass } from "./2.1.0/on_search/class";
import { MockSelectClass } from "./2.1.0/select/class";
import { MockOnSelectClass } from "./2.1.0/on_select/class";
import { MockInitClass } from "./2.1.0/init/class";
import { MockOnInitClass } from "./2.1.0/on_init/class";
import { MockConfirmClass } from "./2.1.0/confirm/class";
import { MockOnConfirmClass } from "./2.1.0/on_confirm/class";
import { MockStatusClass } from "./2.1.0/status/class";
import { MockOnStatusClass } from "./2.1.0/on_status/class";
import type { MockAction } from "./classes/mock-action";
import { MockOnStatusUpdateReceiverInfoClass } from "./2.1.0/on_status_update_receiver_info/class";
import { MockUpdateClass } from "./2.1.0/update/class";
import { MockOnUpdateClass } from "./2.1.0/on_update/class";
import { MockOnCancelClass } from "./2.1.0/on_cancel/class";

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
	on_confirm: MockOnConfirmClass,

	// status / on_status
	status: MockStatusClass,
	on_status: MockOnStatusClass,
	on_status_update_receiver_info: MockOnStatusUpdateReceiverInfoClass,

	//update / on_update
	update: MockUpdateClass,
	on_update: MockOnUpdateClass,

	//on_cancel
	on_cancel: MockOnCancelClass,

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

