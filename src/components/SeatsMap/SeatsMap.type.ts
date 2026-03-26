import { CategoryFilter } from "@seatsio/seatsio-react";

import { SeatsioPricing } from "@/context/BookingContext";
import { SeatsMapSession } from "@/types/seatsMapSession";

export interface SeatsMapProps {
    eventKey: string;
    holdToken?: string;
    pricing?: SeatsioPricing[];
    selectedSeats?: Array<[string, number]>;
    selectedSection?: string;
    mode?: "normal" | "print";
    categoryFilter?: CategoryFilter;
    channels?: string[];
    session: SeatsMapSession;
}