// 201
import { MockCancelHardBus201Class } from "./BUS/2.0.1/cancel/cancel_hard/class";
import { MockCancelSoftBus201Class } from "./BUS/2.0.1/cancel/cancel_soft/class";
import { MockCancelTechBus201Class } from "./BUS/2.0.1/cancel/cancel_tech/class";
import { MockConfirmBus201Class } from "./BUS/2.0.1/confirm/confirm/class";
import { MockConfirmVehConBus201Class } from "./BUS/2.0.1/confirm/confirm_veh_con/class";
import { MockInitBus201Class } from "./BUS/2.0.1/init/class";
import { MockOnCancelBus201Class } from "./BUS/2.0.1/on_cancel/on_cancel/class";
import { MockOnCancelHardBus201Class } from "./BUS/2.0.1/on_cancel/on_cancel_hard/class";
import { MockOnCancelInitBus201Class } from "./BUS/2.0.1/on_cancel/on_cancel_init/class";
import { MockOnCancelSoftBus201Class } from "./BUS/2.0.1/on_cancel/on_cancel_soft/class";
import { MockOnConfirmBus201Class } from "./BUS/2.0.1/on_confirm/on_confirm/class";
import { MockOnConfirmDelayedBus201Class } from "./BUS/2.0.1/on_confirm/on_confirm_delayed/class";
import { MockOnConfirmVehConBus201Class, MockOnConfirmVehConBusQr201Class } from "./BUS/2.0.1/on_confirm/on_confirm_vehicle/class";
import { MockOnInitBus201Class } from "./BUS/2.0.1/on_init/class";
import { MockOnSearch1Bus201Class } from "./BUS/2.0.1/on_search/on_search/class";
import {
  MockOnSearchCatalog1Bus201Class,
  MockOnSearchCatalog2Bus201Class,
  MockOnSearchCatalog3Bus201Class,
  MockOnSearchCatalog4Bus201Class,
  MockOnSearchCatalog5Bus201Class,
} from "./BUS/2.0.1/on_search/on_search_catalog/class";
import { MockOnSelectBus201Class } from "./BUS/2.0.1/on_select/class";
import { MockOnStatusActiveBus201Class } from "./BUS/2.0.1/on_status/on_status_active/class";
import { MockOnStatusCancellationBus201Class } from "./BUS/2.0.1/on_status/on_status_cancellation/class";
import { MockOnUpdateAcceptedBus201Class } from "./BUS/2.0.1/on_update/on_update_accepted/class";
import { MockOnUpdateVehicleBus201Class } from "./BUS/2.0.1/on_update/on_update_vehicle/class";
import { MockOnUpdateVehicleQrBus201Class } from "./BUS/2.0.1/on_update/on_update_vehicle_qr/class";
import { MockSearch0Bus201Class } from "./BUS/2.0.1/search/search0/class";
import { MockSearch1Bus201Class } from "./BUS/2.0.1/search/search1/class";
import { MockSelectBus201Class } from "./BUS/2.0.1/select/class";
import { MockStatusBus201Class } from "./BUS/2.0.1/status/status_ref_id/class";
import { MockUpdateBus201Class } from "./BUS/2.0.1/update/update_/class";
import { MockUpdateQrBus201Class } from "./BUS/2.0.1/update/update_qr/class";
// METRO 2.0.1
import { MockCancelMetro201Class } from "./METRO/2.0.1/cancel/cancel/class";
import { MockCancelHardMetro201Class } from "./METRO/2.0.1/cancel/cancel_hard/class";
import { MockCancelSoftMetro201Class } from "./METRO/2.0.1/cancel/cancel_soft/class";
import { MockCancelTechMetro201Class } from "./METRO/2.0.1/cancel/cancel_tech/class";
import { MockConfirmMetro201Class } from "./METRO/2.0.1/confirm/class";
import { MockInitMetro201Class } from "./METRO/2.0.1/init/class";
import { OnCancelMetro201Class } from "./METRO/2.0.1/on_cancel/on_cancel/class";
import { OnCancelHardMetro201Class } from "./METRO/2.0.1/on_cancel/on_cancel_hard/class";
import { OnCancelInitMetro201Class } from "./METRO/2.0.1/on_cancel/on_cancel_init/class";
import { OnCancelSoftMetro201Class } from "./METRO/2.0.1/on_cancel/on_cancel_soft/class";
import { MockOnConfirmMetro201Class } from "./METRO/2.0.1/on_confirm/on_confirm/class";
import { MockOnConfirmDelayedMetro201Class } from "./METRO/2.0.1/on_confirm/on_confirm_delayed/class";
import { MockOnInitMetro201Class } from "./METRO/2.0.1/on_init/class";
import { MockOnSearch1Metro201Class } from "./METRO/2.0.1/on_search/on_search1/class";
import { MockOnSearch2Metro201Class } from "./METRO/2.0.1/on_search/on_search2/class";
import { MockOnSelectMetro201Class } from "./METRO/2.0.1/on_select/class";
import { MockOnStatusActiveMetro201Class } from "./METRO/2.0.1/on_status/on_status_active/class";
import { MockOnStatusCancelMetro201Class } from "./METRO/2.0.1/on_status/on_status_cancelled/class";
import { MockOnStatusCompleteMetro201Class } from "./METRO/2.0.1/on_status/on_status_complete/class";
import { MockOnUpdateAcceptedMetro201Class } from "./METRO/2.0.1/on_update/on_update_accepted/class";
import { MockSearch1Metro201Class } from "./METRO/2.0.1/search/search1/class";
import { MockSearch2Metro201Class } from "./METRO/2.0.1/search/search2/class";
import { MockSelectMetro201Class } from "./METRO/2.0.1/select/class";
import { MockStatusMetro201Class } from "./METRO/2.0.1/status/status_active/class";
import { MockStatusTechCancelMetro201Class } from "./METRO/2.0.1/status/status_tech_cancel/class";

import { MockAction } from "./classes/mock-action";

// helpers
type Ctor<T> = new () => T;

const registry = {
  // BUS 2.0.1
  cancel_hard_BUS_201: MockCancelHardBus201Class,
  cancel_soft_BUS_201: MockCancelSoftBus201Class,
  cancel_tech_BUS_201: MockCancelTechBus201Class,
  confirm_BUS_201: MockConfirmBus201Class,
  confirm_veh_con_BUS_201: MockConfirmVehConBus201Class,
  init_BUS_201: MockInitBus201Class,
  on_cancel_BUS_201: MockOnCancelBus201Class,
  on_cancel_hard_BUS_201: MockOnCancelHardBus201Class,
  on_cancel_init_BUS_201: MockOnCancelInitBus201Class,
  on_cancel_soft_BUS_201: MockOnCancelSoftBus201Class,
  on_confirm_BUS_201: MockOnConfirmBus201Class,
  on_confirm_delayed_BUS_201: MockOnConfirmDelayedBus201Class,
  on_confirm_veh_con_BUS_201: MockOnConfirmVehConBus201Class,
  on_confirm_BUS_QR_201 :MockOnConfirmVehConBusQr201Class,
  on_init_BUS_201: MockOnInitBus201Class,
  on_search_BUS_201: MockOnSearch1Bus201Class,
  on_search_catalog1_BUS_201: MockOnSearchCatalog1Bus201Class,
  on_search_catalog2_BUS_201: MockOnSearchCatalog2Bus201Class,
  on_search_catalog3_BUS_201: MockOnSearchCatalog3Bus201Class,
  on_search_catalog4_BUS_201: MockOnSearchCatalog4Bus201Class,
  on_search_catalog5_BUS_201: MockOnSearchCatalog5Bus201Class,
  on_select_BUS_201: MockOnSelectBus201Class,
  on_status_active_BUS_201: MockOnStatusActiveBus201Class,
  on_status_cancellation_BUS_201: MockOnStatusCancellationBus201Class,
  on_update_accepted_BUS_201: MockOnUpdateAcceptedBus201Class,
  on_update_veh_con_BUS_201: MockOnUpdateVehicleBus201Class,
  on_update_veh_QR_BUS_201: MockOnUpdateVehicleQrBus201Class,
  search0_BUS_201: MockSearch0Bus201Class,
  search_BUS_201: MockSearch1Bus201Class,
  select_BUS_201: MockSelectBus201Class,
  status_BUS_201: MockStatusBus201Class,
  update_BUS_201: MockUpdateBus201Class,
  update_BUS_QR_201: MockUpdateQrBus201Class,

  // METRO 2.0.1
  cancel_METRO_201: MockCancelMetro201Class,
  cancel_hard_METRO_201: MockCancelHardMetro201Class,
  cancel_soft_METRO_201: MockCancelSoftMetro201Class,
  cancel_tech_METRO_201: MockCancelTechMetro201Class,
  confirm_METRO_201: MockConfirmMetro201Class,
  init_METRO_201: MockInitMetro201Class,
  on_cancel_METRO_201: OnCancelMetro201Class,
  on_cancel_hard_METRO_201: OnCancelHardMetro201Class,
  on_cancel_init_METRO_201: OnCancelInitMetro201Class,
  on_cancel_soft_METRO_201: OnCancelSoftMetro201Class,
  on_confirm_METRO_201: MockOnConfirmMetro201Class,
  on_confirm_delayed_METRO_201: MockOnConfirmDelayedMetro201Class,
  on_init_METRO_201: MockOnInitMetro201Class,
  on_search1_METRO_201: MockOnSearch1Metro201Class,
  on_search2_METRO_201: MockOnSearch2Metro201Class,
  on_select_METRO_201: MockOnSelectMetro201Class,
  on_status_active_METRO_201: MockOnStatusActiveMetro201Class,
  on_status_cancel_METRO_201: MockOnStatusCancelMetro201Class,
  on_status_complete_METRO_201: MockOnStatusCompleteMetro201Class,
  on_update_accepted_METRO_201: MockOnUpdateAcceptedMetro201Class,
  search1_METRO_201: MockSearch1Metro201Class,
  search2_METRO_201: MockSearch2Metro201Class,
  select_METRO_201: MockSelectMetro201Class,
  status_METRO_201: MockStatusMetro201Class,
  status_tech_cancel_METRO_201: MockStatusTechCancelMetro201Class,
} as const satisfies Record<string, Ctor<MockAction>>;

type MockActionId = keyof typeof registry;

export function getMockAction(actionId: string): MockAction {
  const Ctor = registry[actionId as MockActionId];
  if (!Ctor) {
    throw new Error(`Action with ID ${actionId} not found`);
  }
  return new Ctor();
}

export function listMockActions(): MockActionId[] {
  return Object.keys(registry) as MockActionId[];
}
