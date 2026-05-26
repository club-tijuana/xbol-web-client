import { OrderType } from "./enums/order-type.enum";

export interface MyTicketDto {
    id: number;
    orderType: OrderType;
    name: string;
    startDate: Date;
    location: string;
    eventImage: string;
    code: string;
    section: string;
    row: string;
    seat: string;
    qr: string;
    canShare: boolean;
    isShared: boolean;
    isOwner: boolean;
}