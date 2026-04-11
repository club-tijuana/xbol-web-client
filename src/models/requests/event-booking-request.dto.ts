import { BaseBookingRequest } from "./base-booking-request.dto";

export interface EventBookingRequest extends BaseBookingRequest {
    eventKey: string;
}