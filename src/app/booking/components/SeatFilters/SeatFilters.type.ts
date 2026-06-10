import { Pricing } from "@seatsio/seatsio-react";

export interface SeatFiltersProps {
    scheduleId?: number;
    seasonId?: number;
    buttonText: string;
    onZoneSelected?: (zoneLabel: string) => void;
    onZoneChange?: (pricing: Pricing) => void;
}