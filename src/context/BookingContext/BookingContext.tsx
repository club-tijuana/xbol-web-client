"use client";

import { SelectableObject } from "@seatsio/seatsio-react";
import { createContext, ReactNode, useMemo, useState } from "react";

import { BookingContextValue, SeatsioPricing } from "./BookingContext.types";

export const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({
    children,
    initialEventKey,
}: {
    children: ReactNode;
    initialEventKey: string;
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedObjects, setSelectedObjects] = useState<SelectableObject[]>([]);
    const [pricing, setPricing] = useState<SeatsioPricing[]>([]);
    const [eventKey, setEventKey] = useState<string>(initialEventKey);

    const nextStep = () => setCurrentStep((s) => s + 1);
    const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));

    const selectObject = (obj: SelectableObject) => {
        if (!("status" in obj)) return;
        if (obj.status !== "free") return;

        setSelectedObjects((prev) => {
            if (prev.some((o) => o.label === obj.label)) return prev;
            return [...prev, obj];
        });
    };

    const removeObject = (label: string) => {
        setSelectedObjects((prev) =>
            prev.filter((o) => o.label !== label)
        );
    };

    const resetBooking = () => {
        setCurrentStep(0);
        setSelectedObjects([]);
    };

    const updatePricing = (newPricing: SeatsioPricing[]) => {
        setPricing(newPricing);
    };

    const setEvent = (key: string) => {
        setEventKey(key);
        setSelectedObjects([]);
        setCurrentStep(0);
    };

    const value = useMemo(
        () => ({
            currentStep,
            selectedObjects,
            pricing,
            eventKey,
            nextStep,
            prevStep,
            selectObject,
            removeObject,
            resetBooking,
            updatePricing,
            setEvent,
        }),
        [currentStep, selectedObjects, pricing, eventKey]
    );

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}
