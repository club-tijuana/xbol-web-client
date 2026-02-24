import { MyEventSeatDTO } from "@/models/my-event-seat.dto";

export interface TicketSeatsProps {
    eventKey: string;
    subTotal: number;
    totalFees: number;
    totalTaxes: number;
    total: number;
    currency: string;
    seats: Array<MyEventSeatDTO>;
    selectedSeats: Array<string>;
}