import { ItemType } from "../enums/item-type.enum";

import { BookingSeatRequest } from "./booking-seat-request.dto";
import { ChangeInfoRequest } from "./change-info-request.dto";
import { ClientInfoRequest } from "./client-info-request.dto";
import { PaymentInfoRequest } from "./payment-info-request.dto";
import { PaymentLinkRequest } from "./payment-link-request.dto";

export interface BaseBookingRequest {
    seats: BookingSeatRequest[];
    holdToken: string;
    bundleId?: number;
    eventScheduleId?: number;
    ticketType: ItemType;
    clientContact: ClientInfoRequest;
    paymentInfoRequest: PaymentInfoRequest;
    changeInfoRequest?: ChangeInfoRequest;
    localizer?: string;
    referenceOrderId?: number;
    isPaymentLink: boolean;

    sessionId?: string;
    orderRefId?: string;
    transactionRefId?: string;
}