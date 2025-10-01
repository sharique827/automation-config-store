import { MockCancelCancelFlow1Class } from "./2.0.0/cancel/cancel_cancel_flow_1/class";
import { MockCancelCancelFlow2Class } from "./2.0.0/cancel/cancel_cancel_flow_2/class";
import { MockConfirmStationCodeClass } from "./2.0.0/confirm/confirm_station_code/class";
import { MockConfirmSellerCancellationClass } from "./2.0.0/confirm/confirm_seller_cancellation/class";
import { MockInitErrorResponseClass } from "./2.0.0/init/init_error_response/class";
import { MockInitStationCodeClass } from "./2.0.0/init/init_station_code/class";
import { MockOnCancelCancelFlow1Class } from "./2.0.0/on_cancel/on_cancel_cancel_flow_1/class";
import { MockOnCancelCancelFlow2Class } from "./2.0.0/on_cancel/on_cancel_cancel_flow_2/class";
import { MockOnCancelSellerCancellationClass } from "./2.0.0/on_cancel/on_cancel_seller_cancellation/class";
import { MockOnConfirmCancelFlowClass } from "./2.0.0/on_confirm/on_confirm_cancel_flow/class";
import { MockOnConfirmPartialCancellationClass } from "./2.0.0/on_confirm/on_confirm_partial_cancellation/class";
import { MockOnConfirmRatingErrorClass } from "./2.0.0/on_confirm/on_confirm_rating_error/class";
import { MockOnConfirmRatingSuccessClass } from "./2.0.0/on_confirm/on_confirm_rating_success/class";
import { MockOnConfirmSellerCancellationClass } from "./2.0.0/on_confirm/on_confirm_seller_cancellation/class";
import { MockOnConfirmStationCodeClass } from "./2.0.0/on_confirm/on_confirm_station_code/class";
import { MockOnInitErrorResponseClass } from "./2.0.0/on_init/on_init_error_response/class";
import { MockOnInitStationCodeClass } from "./2.0.0/on_init/on_init_station_code/class";
import { MockOnRatingErrorClass } from "./2.0.0/on_rating/on_rating_error/class";
import { MockOnSearchStationCode1Class } from "./2.0.0/on_search/on_search_station_code_1/class";
import { MockOnSearchStationCode2Class } from "./2.0.0/on_search/on_search_station_code_2/class";
import { MockOnSearchStationCode3Class } from "./2.0.0/on_search/on_search_station_code_3/class";
import { MockOnSelectErrorResponseClass } from "./2.0.0/on_select/on_select_error_response/class";
import { MockOnSelectStationCode1Class } from "./2.0.0/on_select/on_select_station_code_1/class";
import { MockOnSelectStationCode2Class } from "./2.0.0/on_select/on_select_station_code_2/class";
import { MockOnStatusRatingErrorClass } from "./2.0.0/on_status/on_status_rating_error/class";
import { MockOnStatusRatingSuccessClass } from "./2.0.0/on_status/on_status_rating_success/class";
import { MockOnStatusStationCode1Class } from "./2.0.0/on_status/on_status_station_code_1/class";
import { MockOnStatusStationCode2Class } from "./2.0.0/on_status/on_status_station_code_2/class";
import { MockOnUpdatePartialCancellation1Class } from "./2.0.0/on_update/on_update_partial_cancellation_flow_1/class";
import { MockOnUpdatePartialCancellation2Class } from "./2.0.0/on_update/on_update_partial_cancellation_flow_2/class";
import { MockRatingErrorClass } from "./2.0.0/rating/rating_error/class";
import { MockRatingSuccessClass } from "./2.0.0/rating/rating_success/class";
import { MockSearchStationCode1Class } from "./2.0.0/search/search_station_code_1/class";
import { MockSearchStationCode2Class } from "./2.0.0/search/search_station_code_2/class";
import { MockSearchStationCode3Class } from "./2.0.0/search/search_station_code_3/class";
import { MockSelectErrorResponseClass } from "./2.0.0/select/select_error_response/class";
import { MockSelectStationCode1Class } from "./2.0.0/select/select_station_code_1/class";
import { MockSelectStationCode2Class } from "./2.0.0/select/select_station_code_2/class";
import { MockStatusStationCodeClass } from "./2.0.0/status/status_station_code/class";
import { MockUpdatePartialCancellation1Class } from "./2.0.0/update/update_partial_cancellation_flow_1/class";
import { MockUpdatePartialCancellation2Class } from "./2.0.0/update/update_partial_cancellation_flow_2/class";
import { MockAction } from "./classes/mock-action";

export function getMockAction(actionId: string): MockAction {
  switch (actionId) {
    case "search_BUS_201":
      return new MockSearchStationCode1Class();
    case "search_BUS_202":
      return new MockSearchStationCode2Class();
    case "search_BUS_203":
      return new MockSearchStationCode3Class();

    case "on_search_BUS_201":
      return new MockOnSearchStationCode1Class();
    case "on_search_BUS_202":
      return new MockOnSearchStationCode2Class();
    case "on_search_BUS_203":
      return new MockOnSearchStationCode3Class();

    case "select_BUS_201":
      return new MockSelectStationCode1Class();
    case "select_BUS_202":
      return new MockSelectStationCode2Class();
    case "select_BUS_221":
      return new MockSelectErrorResponseClass();

    case "on_select_BUS_201":
      return new MockOnSelectStationCode1Class();
    case "on_select_BUS_202":
      return new MockOnSelectStationCode2Class();
    case "on_select_BUS_221":
      return new MockOnSelectErrorResponseClass();

    case "init_BUS_201":
      return new MockInitStationCodeClass();
    case "init_BUS_221":
      return new MockInitErrorResponseClass();

    case "on_init_BUS_201":
      return new MockOnInitStationCodeClass();
    case "on_init_BUS_221":
      return new MockOnInitErrorResponseClass();

    case "confirm_BUS_201":
      return new MockConfirmStationCodeClass();
    case "confirm_BUS_241":
      return new MockConfirmSellerCancellationClass();
    case "on_confirm_BUS_201":
      return new MockOnConfirmStationCodeClass();
    case "on_confirm_BUS_211":
      return new MockOnConfirmCancelFlowClass();
    case "on_confirm_BUS_231":
      return new MockOnConfirmPartialCancellationClass();
    case "on_confirm_BUS_241":
      return new MockOnConfirmSellerCancellationClass();
    case "on_confirm_BUS_251":
      return new MockOnConfirmRatingSuccessClass();
    case "on_confirm_BUS_261":
      return new MockOnConfirmRatingErrorClass();

    case "cancel_BUS_211":
      return new MockCancelCancelFlow1Class();
    case "cancel_BUS_212":
      return new MockCancelCancelFlow2Class();

    case "on_cancel_BUS_211":
      return new MockOnCancelCancelFlow1Class();
    case "on_cancel_BUS_212":
      return new MockOnCancelCancelFlow2Class();
    case "on_cancel_BUS_241":
      return new MockOnCancelSellerCancellationClass();

    case "status_BUS_201":
      return new MockStatusStationCodeClass();
    case "on_status_BUS_201":
      return new MockOnStatusStationCode1Class();
    case "on_status_unsolicited_201":
      return new MockOnStatusStationCode2Class();
    case "on_status_BUS_251":
      return new MockOnStatusRatingSuccessClass();
    case "on_status_BUS_261":
      return new MockOnStatusRatingErrorClass();

    case "update_BUS_231":
      return new MockUpdatePartialCancellation1Class();
    case "update_BUS_232":
      return new MockUpdatePartialCancellation2Class();

    case "on_update_BUS_231":
      return new MockOnUpdatePartialCancellation1Class();
    case "on_update_BUS_232":
      return new MockOnUpdatePartialCancellation2Class();

    case "rating_251":
      return new MockRatingSuccessClass();
    case "rating_261":
      return new MockRatingErrorClass();
    case "on_rating_261":
      return new MockOnRatingErrorClass();

    default:
      throw new Error(`Action with ID ${actionId} not found`);
  }
}
