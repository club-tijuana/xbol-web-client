import { SeatsioPricing } from "@/context/BookingContext";
import { SelectableObject } from "@seatsio/seatsio-react";

export interface SeatsMapProps {
    eventKey: string;
    pricing?: SeatsioPricing[];
    onSelected?: (obj: SelectableObject) => void;
    onDeselected?: (obj: SelectableObject) => void;
}