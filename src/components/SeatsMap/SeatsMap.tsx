"use client";

import { SeatingChart, SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { MyEventSeatDTO } from "@/models/my-event-seat.dto";

import { SeatsMapProps } from "./SeatsMap.type";

export interface SeatsMapHandle {
    getSelectedSeats: () => string[];
    getSelectedSeatsDto: () => MyEventSeatDTO[];
    clearSelection: () => void;
}

const SeatsMap = forwardRef<SeatsMapHandle, SeatsMapProps>(
    ({ eventKey, pricing, selectedSeats, selectedSection, mode = "normal" }, ref) => {

        const chartRef = useRef<SeatingChart | null>(null);
        const [currentSelectedSeats, setCurrentSelectedSeats] = useState<string[]>(selectedSeats ?? []);
        const [currentSelectedSeatsDto, setCurrentSelectedSeatsDto] = useState<MyEventSeatDTO[]>([]);
        const selectedSeatsRef = useRef<string[]>([]);
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

                chartRef.current.deselectObjects(selectedSeatsRef.current);
                setCurrentSelectedSeats([]);
                setCurrentSelectedSeatsDto([]);
            }
        }));

        const handleSelected = (obj: SelectableObject) => {
            if (selectedSeats?.includes(obj.label)) return;

            setCurrentSelectedSeats(prev => [...prev, obj.label]);

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

            setCurrentSelectedSeats(prev => prev.filter(s => s !== obj.label));

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
                    selectedObjects={selectedSeats}
                    onObjectSelected={handleSelected}
                    onObjectDeselected={handleDeselected}
                    onChartRendered={(chart) => {
                        chartRef.current = chart;

                        if (selectedSection) chart.zoomToSection(selectedSection);
                        if (selectedSeats) chart.zoomToObjects(selectedSeats);
                    }}
                    showMinimap={mode !== "print"}
                />
            </div>
        );
    }
);

SeatsMap.displayName = "SeatsMap";

export default SeatsMap;