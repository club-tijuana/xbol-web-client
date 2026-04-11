import { Pricing } from "@seatsio/seatsio-react";

export interface SeatFiltersProps {
    scheduleId?: number;
    seasonId?: number;
    buttonText: string;
    onSectionSelected?: (section: string) => void;
    onSectionsChange?: (pricing: Pricing) => void;
}