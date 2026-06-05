import { CategoryFilter, Pricing } from "@seatsio/seatsio-react";

export interface SeatsMapProps {
    eventKey: string;
    pricing?: Pricing;
    initialSeats?: Array<[string, number]>;
    selectedZone?: string;
    mode?: "normal" | "print";
    categoryFilter?: CategoryFilter;
    channels?: string[];
    blockSameSeats?: boolean;
    isRenewalWindow?: boolean;

    onSeatsChange?: () => void;
}