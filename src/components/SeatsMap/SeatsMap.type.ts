import { CategoryFilter } from "@seatsio/seatsio-react";

import { SeatsioPricing } from "@/context/BookingContext";

export interface SeatsMapProps {
    eventKey: string;
    pricing?: SeatsioPricing[];
    selectedSeats?: Array<[string, number]>;
    selectedSection?: string;
    mode?: "normal" | "print";
    categoryFilter?: CategoryFilter;
    channels?: string[];
}