"use client";

import { SeatingChart, SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { MyEventSeatDTO } from "@/models/my-event-seat.dto";

import { SeatsMapProps } from "./SeatsMap.type";

/* -------------------- TYPES -------------------- */
type Session = 'continue' | 'manual' | 'none' | 'start';

/* -------------------- CONSTANTS -------------------- */
const SESSION_NONE: Session = "none";

export interface SeatsMapHandle {
    getSelectedSeats: () => Array<[string, number]>;
    getSelectedSeatsDto: () => MyEventSeatDTO[];
    clearSelection: () => void;
}

const SeatsMap = forwardRef<SeatsMapHandle, SeatsMapProps>(
    ({
        eventKey,
        pricing,
        selectedSeats,
        selectedSection,
        mode = "normal",
        categoryFilter = {
            enabled: true,
            sortBy: "price",
            multiSelect: true,
            zoomOnSelect: true
        },
        channels
    }, ref) => {

        const chartRef = useRef<SeatingChart | null>(null);
        const [currentSelectedSeats, setCurrentSelectedSeats] = useState<[string, number][]>(selectedSeats ?? []);
        const [currentSelectedSeatsDto, setCurrentSelectedSeatsDto] = useState<MyEventSeatDTO[]>([]);
        const selectedSeatsRef = useRef<Array<[string, number]>>([]);
        const selectedSeatsDtoRef = useRef<MyEventSeatDTO[]>([]);

        useEffect(() => {
            selectedSeatsRef.current = currentSelectedSeats;
            selectedSeatsDtoRef.current = currentSelectedSeatsDto;
        }, [currentSelectedSeats, currentSelectedSeatsDto]);

        useEffect(() => {
            if (!chartRef.current) return;

            if (selectedSection) {
                chartRef.current.zoomToSection(selectedSection);
            }
        }, [selectedSection]);

        useImperativeHandle(ref, () => ({
            getSelectedSeats: () => selectedSeatsRef.current,

            getSelectedSeatsDto: () => selectedSeatsDtoRef.current,

            clearSelection: () => {
                if (!chartRef.current) return;

                chartRef.current.deselectObjects(selectedSeatsRef.current.map(s => s[0]));
                setCurrentSelectedSeats([]);
                setCurrentSelectedSeatsDto([]);
            }
        }));

        const handleSelected = (obj: SelectableObject) => {
            const seatLabels = selectedSeats?.map(s => s[0]);
            if (seatLabels?.includes(obj.label)) return;

            setCurrentSelectedSeats(prev => [...prev, [obj.label, Number.parseFloat(obj.pricing.price?.toString() ?? "0")]]);

            const current = currentSelectedSeatsDto ?? [];
            const sectionFound = current.find(s => s.section.startsWith(obj.labels.section ?? ""));

            if (sectionFound) {
                const updatedSeats = sectionFound.seats
                    ? `${sectionFound.seats},${obj.labels.own}`
                    : obj.labels.own;

                const sectionName = updatedSeats.split(",").length > 1
                    ? `${obj.labels.section} x${updatedSeats.split(",").length}`
                    : obj.labels.section ?? "";

                setCurrentSelectedSeatsDto([
                    { section: sectionName, seats: updatedSeats },
                    ...current.filter(s => s.section !== sectionFound.section)
                ]);
            }
            else {
                setCurrentSelectedSeatsDto([
                    ...current,
                    { section: obj.labels.section ?? "", seats: obj.labels.own }
                ]);
            }
        };

        const handleDeselected = (obj: SelectableObject) => {
            if (!obj.labels.section) return;

            setCurrentSelectedSeats(prev => prev.filter(s => s[0] !== obj.label));

            const current = currentSelectedSeatsDto ?? [];
            const sectionFound = current.find(s => s.section.startsWith(obj.labels.section ?? ""));

            if (!sectionFound) return;

            const seatsArray = sectionFound.seats.split(",").map(s => s.trim());
            const updatedSeatsArray = seatsArray.filter(s => s !== obj.labels.own);

            if (updatedSeatsArray.length === 0) {
                setCurrentSelectedSeatsDto(current.filter(s => s.section !== sectionFound.section));
            }
            else {
                const sectionName = updatedSeatsArray.length > 1
                    ? `${obj.labels.section} x${updatedSeatsArray.length}`
                    : obj.labels.section;

                setCurrentSelectedSeatsDto([
                    { section: sectionName, seats: updatedSeatsArray.join(",") },
                    ...current.filter(s => s.section !== sectionFound.section)
                ]);
            }
        };

        return (
            <div>
                <SeatsioSeatingChart
                    workspaceKey={process.env.NEXT_PUBLIC_SEATS_WORKSPACE_KEY}
                    event={eventKey}
                    region="na"
                    pricing={pricing}
                    mode={mode}
                    selectedObjects={selectedSeats?.map(s => s[0])}
                    onObjectSelected={handleSelected}
                    onObjectDeselected={handleDeselected}
                    onChartRendered={(chart) => {
                        chartRef.current = chart;

                        if (selectedSection) chart.zoomToSection(selectedSection);
                        if (selectedSeats) chart.zoomToObjects(selectedSeats.map(s => s[0]));
                    }}
                    showMinimap={mode !== "print"}
                    categoryFilter={categoryFilter}
                    channels={channels}
                    session={SESSION_NONE}
                />
            </div>
        );
    }
);

SeatsMap.displayName = "SeatsMap";

export default SeatsMap;