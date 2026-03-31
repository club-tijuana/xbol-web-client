import { Pricing } from "@seatsio/seatsio-react";

export interface SeatFiltersProps {
    scheduleId: number;
    buttonText: string;
    onSectionSelected?: (section: string) => void;
    onSectionsChange?: (pricing: Pricing) => void;
}