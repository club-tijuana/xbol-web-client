import { CategoryFilter, Pricing } from "@seatsio/seatsio-react";

import { SeatsMapSession } from "@/types/seatsMapSession";


export interface SeatsMapProps {
    eventKey: string;
    holdToken?: string;
    pricing?: Pricing;
    initialSeats?: Array<[string, number]>;
    selectedSection?: string;
    mode?: "normal" | "print";
    categoryFilter?: CategoryFilter;
    channels?: string[];
    session: SeatsMapSession;
    blockSameSeats?: boolean;

    onSeatsChange?: () => void;
}