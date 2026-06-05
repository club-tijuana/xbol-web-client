import { OrderType } from "./enums/order-type.enum";
import { MyEventSeatDTO } from "./my-event-seat.dto";
import { SeatDTO } from "./seat.dto";

export interface OrderDTO {
    id: number;
    folio: string;
    orderType: OrderType;
    subTotal: number;
    totalFees: number;
    totalTaxes: number;
    discount: number;
    total: number;
    currency: string;
    itemName: string;
    itemLocation: string;
    itemKey: string;
    itemSeats: MyEventSeatDTO[];
    itemPosterImageUrl: string;
    itemStartDate: Date;
    itemSeatsLabels: SeatDTO[];
}