"use client";

import { useEffect } from "react";

import { useBooking } from "@/context/BookingContext";

import SeatSelectionStep from "./SeatSelectionStep";

export default function BookingInitializer({ eventKey }: { eventKey: string }) {
  const { setEvent } = useBooking();

  useEffect(() => {
    if (!eventKey) return;
    setEvent(eventKey);
  }, [eventKey, setEvent]);

  return <SeatSelectionStep />;
}
