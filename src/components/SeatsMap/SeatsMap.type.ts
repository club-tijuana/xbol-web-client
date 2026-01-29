import { SelectableObject } from "@seatsio/seatsio-react";

import { SeatsioPricing } from "@/context/BookingContext";

export interface SeatsMapProps {
    eventKey: string;
    pricing?: SeatsioPricing[];
    onSelected?: (obj: SelectableObject) => void;
    onDeselected?: (obj: SelectableObject) => void;
}