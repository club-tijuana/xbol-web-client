"use client";

import { BookingProvider } from "@/context/BookingContext";

import SeatSelectionStep from "./SeatSelectionStep";

export default function BookingFlow({ eventKey }: { eventKey: string }) {
    return (
        <BookingProvider initialEventKey={eventKey}>
            <SeatSelectionStep />
        </BookingProvider>
    );
}
