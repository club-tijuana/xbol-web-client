import { MyEventSeatDTO } from "@/models/my-event-seat.dto";

export interface TicketSeatsProps {
    subTotal: number;
    totalFees: number;
    totalTaxes: number;
    total: number;
    seats: Array<MyEventSeatDTO>;
    selectedSeats: Array<string>;
}