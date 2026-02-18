import { SelectableObject } from "@seatsio/seatsio-react";

import { SeatsioPricing } from "@/context/BookingContext";

export interface SeatsMapProps {
    eventKey: string;
    pricing?: SeatsioPricing[];
    selectedObjects?: Array<string>;
    mode?: "normal" | "print";
    onSelected?: (obj: SelectableObject) => void;
    onDeselected?: (obj: SelectableObject) => void;
}