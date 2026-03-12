import { ItemType } from "../enums/item-type.enum";

import { ClientInfoRequest } from "./client-info-request.dto";
import { PaymentInfoRequest } from "./payment-info-request.dto";

export interface BaseBookingRequest {
    seats: Array<[string, number]>;
    holdToken?: string;
    ticketType: ItemType;
    clientContact: ClientInfoRequest;
    paymentInfoRequest: PaymentInfoRequest;
}