import { ItemType } from "../enums/item-type.enum";

import { ClientInfoRequest } from "./client-info-request.dto";
import { PaymentInfoRequest } from "./payment-info-request.dto";

export interface BaseBookingRequest {
    eventScheduleId: number,
    seats: unknown,
    holdToken?: string;
    ticketType: ItemType;
    clientContact: ClientInfoRequest;
    paymentInfoRequest: PaymentInfoRequest;
}