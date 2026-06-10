import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";

export interface TicketSeatsProps {
    eventKey: string;
    subTotal?: number;
    totalFees?: number;
    totalTaxes?: number;
    discount?: number;
    total?: number;
    currency?: string;
    seats: Array<MyEventSeatDTO>;
    selectedSeats?: Array<BookingSeatRequest>;
    folio?: string;
}