import { MockSearchClass } from "./2.0.2/search/class";
import { MockOnSearchClass } from "./2.0.2/on_search/class";
import { MockSelectClass} from "./2.0.2/select/class";
import { MockSelect1Class } from "./2.0.2/select_1/class";
import { MockSelect2Class } from "./2.0.2/select_2/class";
import { MockOnSelectClass } from "./2.0.2/on_select/class";
import { MockOnSelect1Class } from "./2.0.2/on_select_1/class";
import { MockOnSelect2Class } from "./2.0.2/on_select_2/class";
import { MockInitClass } from "./2.0.2/init/class";
import { MockOnInitClass } from "./2.0.2/on_init/class";
import { MockConfirmClass } from "./2.0.2/confirm/class";
import { MockOnConfirmClass } from "./2.0.2/on_confirm/class";
import { MockUpdateClass } from "./2.0.2/update/class";
import { MockOnUpdateClass } from "./2.0.2/on_update/class";
import { MockOnUpdateUnsolicitedClass } from "./2.0.2/on_update_unsolicited/class";
import type { MockAction } from "./classes/mock-action";
import { MockConsumerInformationFormClass } from "./2.0.2/form/consumer_information_form";
import { MockLoanAdjustmentFormClass } from "./2.0.2/form_2/loan_adjustment_form";

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
	select_1: MockSelect1Class,
	select_2: MockSelect2Class,
	on_select: MockOnSelectClass,
	on_select_1: MockOnSelect1Class,
	on_select_2: MockOnSelect2Class,

	// init / on_init
	init: MockInitClass,
	on_init: MockOnInitClass,

	// confirm / on_confirm
	confirm: MockConfirmClass,
	on_confirm: MockOnConfirmClass,

	// update / on_update
	update: MockUpdateClass,
	on_update: MockOnUpdateClass,
	on_update_unsolicited: MockOnUpdateUnsolicitedClass,
	consumer_information_form: MockConsumerInformationFormClass,
	loan_adjustment_form: MockLoanAdjustmentFormClass,

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
