// import { MockSelect_1_Class } from "./2.0.0/select/select_1/class";
// import { MockOnSelect_1_Class } from "./2.0.0/on_select/on_select_1/class";
// import { MockInitClass } from "./2.0.0/init/class";
// import { MockOnInitClass } from "./2.0.0/on_init/class";
// import { MockConfirmClass } from "./2.0.0/confirm/class";
// import { MockOnConfirmDefaultClass } from "./2.0.0/on_confirm/class";
// import { MockCancelClass } from "./2.0.0/cancel/class";
// import { MockOnCancelDefaultClass } from "./2.0.0/on_cancel/class";
// import { search_1_Hotel } from "./2.0.0/search/search_1/class";
// import { MockOnSearch_1 } from "./2.0.0/on_search/on_search_1/class";
// import { MockOnSearch_2 } from "./2.0.0/on_search/on_search_2/class";
// import { MockOnSearch_3 } from "./2.0.0/on_search/on_search_3/class";
// import { MockOnSearch_4 } from "./2.0.0/on_search/on_search_4/class";
// import { MockSelect_2_Class } from "./2.0.0/select/select_2/class";
// import { MockOnSelect_2_Class } from "./2.0.0/on_select/on_select_2/class";

// export function getMockAction(actionId: string) {
//   switch (actionId) {
//     case "search_1":
//       return new search_1_Hotel();
//     case "on_search_1":
//       return new MockOnSearch_1();
//     case "on_search_2":
//       return new MockOnSearch_2();
//     case "on_search_3":
//       return new MockOnSearch_3();
//     case "on_search_4":
//       return new MockOnSearch_4();
//     case "select_1":
//       return new MockSelect_1_Class();
//     case "on_select_1":
//       return new MockOnSelect_1_Class();
//     case "select_2":
//       return new MockSelect_2_Class();
//     case "on_select_2":
//       return new MockOnSelect_2_Class();  
//     case "init":
//       return new MockInitClass();
//     case "on_init":
//       return new MockOnInitClass();
//     case "confirm":
//       return new MockConfirmClass();
//     case "on_confirm":
//       return new MockOnConfirmDefaultClass();
//     case "cancel":
//       return new MockCancelClass();
//     case "on_cancel":
//       return new MockOnCancelDefaultClass();    
//     default:
//       throw new Error(`Action with ID ${actionId} not found`);
//   }
// }

import { MockSelect_1_Class } from "./2.0.0/select/select_1/class";
import { MockOnSelect_1_Class } from "./2.0.0/on_select/on_select_1/class";
import { MockInitClass } from "./2.0.0/init/class";
import { MockOnInitClass } from "./2.0.0/on_init/class";
import { MockConfirmClass } from "./2.0.0/confirm/class";
import { MockOnConfirmDefaultClass } from "./2.0.0/on_confirm/class";
import { MockCancelClass } from "./2.0.0/cancel/class";
import { MockOnCancelDefaultClass } from "./2.0.0/on_cancel/class";
import { search_1_Hotel } from "./2.0.0/search/search_1/class";
import { MockOnSearch_1 } from "./2.0.0/on_search/on_search_1/class";
import { MockOnSearch_2 } from "./2.0.0/on_search/on_search_2/class";
import { MockOnSearch_3 } from "./2.0.0/on_search/on_search_3/class";
import { MockOnSearch_4 } from "./2.0.0/on_search/on_search_4/class";
import { MockSelect_2_Class } from "./2.0.0/select/select_2/class";
import { MockOnSelect_2_Class } from "./2.0.0/on_select/on_select_2/class";

import type { MockAction } from "./classes/mock-action";

// types/helpers
type Ctor<T> = new () => T;

// === keep imports exactly as they are ===

// Build registry
const registry = {
  // search / on_search
  search_1: search_1_Hotel,
  on_search_1: MockOnSearch_1,
  on_search_2: MockOnSearch_2,
  on_search_3: MockOnSearch_3,
  on_search_4: MockOnSearch_4,

  // select / on_select
  select_1: MockSelect_1_Class,
  on_select_1: MockOnSelect_1_Class,
  select_2: MockSelect_2_Class,
  on_select_2: MockOnSelect_2_Class,

  // init / on_init
  init: MockInitClass,
  on_init: MockOnInitClass,

  // confirm / on_confirm
  confirm: MockConfirmClass,
  on_confirm: MockOnConfirmDefaultClass,

  // cancel / on_cancel
  cancel: MockCancelClass,
  on_cancel: MockOnCancelDefaultClass,

} as const satisfies Record<string, Ctor<MockAction>>;

type MockActionId = keyof typeof registry;

// Construct by id
export function getMockAction(actionId: string): MockAction {
  const Ctor = registry[actionId as MockActionId];
  if (!Ctor) {
    throw new Error(`Action with ID ${actionId} not found`);
  }
  return new Ctor();
}

// List all possible ids
export function listMockActions(): MockActionId[] {
  return Object.keys(registry) as MockActionId[];
}
