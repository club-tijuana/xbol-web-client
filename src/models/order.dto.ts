import { OrderType } from "./enums/order-type.enum";
import { MyEventSeatDTO } from "./my-event-seat.dto";

export interface OrderDTO {
    id: number;
    folio: string;
    orderType: OrderType;
    subTotal: number;
    totalFees: number;
    totalTaxes: number;
    total: number;
    currency: string;
    itemName: string;
    itemLocation: string;
    itemKey: string;
    itemSeats: MyEventSeatDTO[];
    itemPosterImageUrl: string;
    itemStartDate: Date;
}