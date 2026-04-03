import { CategoryFilter, Pricing } from "@seatsio/seatsio-react";

import { SeatsMapSession } from "@/types/seatsMapSession";

export interface SeatsMapProps {
    eventKey: string;
    holdToken?: string;
    pricing?: Pricing;
    selectedSeats?: Array<[string, number]>;
    selectedSection?: string;
    mode?: "normal" | "print";
    categoryFilter?: CategoryFilter;
    channels?: string[];
    session: SeatsMapSession;
    isRenovation?: boolean;

    onSeatsChange?: () => void;
}