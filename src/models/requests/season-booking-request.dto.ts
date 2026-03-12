import { BaseBookingRequest } from "./base-booking-request.dto";

export interface SeasonBookingRequest extends BaseBookingRequest {
    seasonKey?: string;
    refereceOrderId?: number;
}