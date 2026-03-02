import { SeatsioPricing } from "@/context/BookingContext";

export interface SeatsMapProps {
    eventKey: string;
    pricing?: SeatsioPricing[];
    selectedSeats?: Array<string>;
    selectedSection?: string;
    mode?: "normal" | "print";
}