import { ItemType } from "../enums/item-type.enum";

import { BookingSeatRequest } from "./booking-seat-request.dto";
import { ChangeInfoRequest } from "./change-info-request.dto";
import { ClientInfoRequest } from "./client-info-request.dto";
import { PaymentInfoRequest } from "./payment-info-request.dto";
import { PaymentLinkRequest } from "./payment-link-request.dto";

export interface BookSeatsBody {
    seats: BookingSeatRequest[];
    holdToken?: string | null;
    bundleId?: number | null;
    eventScheduleId?: number | null;
    ticketType: ItemType;
    clientContact?: ClientInfoRequest | null;
    paymentInfoRequest: PaymentInfoRequest;
    changeInfoRequest?: ChangeInfoRequest | null;
    localizer?: string | null;
    referenceOrderId?: number | null;
    isPaymentLink: boolean;
    paymentLinkRequest?: PaymentLinkRequest | null;
}