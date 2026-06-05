import { OrderType } from "./enums/order-type.enum";
import { TicketType } from "./enums/ticket-type.enum";

export interface MyTicketDto {
    id: number;
    orderReference: string;
    orderType: OrderType;
    name: string;
    startDate: Date;
    location: string;
    eventImage: string;
    code: string;
    type: TicketType;
    pricePaid: number;
    section: string;
    row: string;
    seat: string;
    qr: string;
    canShare: boolean;
    isShared: boolean;
    isOwner: boolean;
}