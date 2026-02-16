import { MyEventSeatDTO } from "./my-event-seat.dto";

export interface MyEventDetailDTO {
    orderId: number;
    eventId: number;
    eventImage: string;
    folio: string;
    name: string;
    date: Date;
    location: string;
    subTotal: number;
    totalFees: number;
    totalTaxes: number;
    total: number;
    seats: Array<MyEventSeatDTO>;
    selectedSeats: Array<string>;
}