import { ItemType } from "../enums/item-type.enum";

import { ClientInfoRequest } from "./client-info-request.dto";
import { PaymentInfoRequest } from "./payment-info-request.dto";

export interface BaseBookingRequest {
    scheduleId: number,
    seats: unknown,
    holdToken?: string;
    ticketType: ItemType;
    clientContact: ClientInfoRequest;
    paymentInfoRequest: PaymentInfoRequest;
}