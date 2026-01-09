import { SelectableObject } from "@seatsio/seatsio-react";

export interface BookingState {
    currentStep: number;
    selectedObjects: SelectableObject[];
    pricing: SeatsioPricing[];
    eventKey: string | null;
}

export interface SeatsioPricing {
    category: number;
    price: number;
}

export interface BookingContextValue extends BookingState {
    setEvent: (eventKey: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    selectObject: (obj: SelectableObject) => void;
    removeObject: (label: string) => void;
    resetBooking: () => void;
}