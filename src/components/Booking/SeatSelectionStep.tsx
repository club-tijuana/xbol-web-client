"use client";

import SeatsMap from "@/components/SeatsMap/SeatsMap";
import { useBooking } from "@/context/BookingContext";

export default function SeatSelectionStep() {
    const { eventKey, pricing, selectObject, removeObject } = useBooking();

    const pricingKey = JSON.stringify(pricing);

    return (
        <SeatsMap
            key={pricingKey}
            eventKey={eventKey || ""}
            pricing={pricing}
            onSelected={selectObject}
            onDeselected={(obj) => removeObject(obj.label)}
        />
    );
}