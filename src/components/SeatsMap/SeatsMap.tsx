"use client";

import { SeatingChart, SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSeats } from "@/store/slices/bookingFlowSlice";

import Loader from "../Loader/Loader";

import { SeatsMapProps } from "./SeatsMap.type";

/* -------------------- CONSTANTS -------------------- */
const MAX_SEATS_SELECTION: number = 12;
const DISABLED_SELECTED_SEAT_COLOR: string = "#902748";

export interface SeatsMapHandle {
    getSelectedSeats: () => Array<[string, number]>;
    getSelectedSeatsDto: () => MyEventSeatDTO[];
    clearSelection: () => void;
}

const SeatsMap = forwardRef<SeatsMapHandle, SeatsMapProps>(
    ({
        eventKey,
        holdToken,
        pricing,
        initialSeats,
        selectedSection,
        mode = "normal",
        categoryFilter = {
            enabled: true,
            sortBy: "price",
            multiSelect: true,
            zoomOnSelect: true
        },
        channels,
        session,
        blockSameSeats = false,
        onSeatsChange
    }, ref) => {
        const dispatch = useAppDispatch();
        const orderLeftSeats = useAppSelector(store => store.bookingFlow.orderLeftSeats);
        const chartRef = useRef<SeatingChart | null>(null);
        const [isLoading, setIsLoading] = useState(false);
        const selectedSeatsRef = useRef<Array<[string, number]>>(initialSeats ?? []);
        const chartConfig = eventKey
            ? { holdToken, eventKey }
            : null;
        const initialSelectedSeats: Array<string> | undefined = initialSeats ? initialSeats.map(s => s[0]) : undefined;

        const groupSeatsBySection = (seats: Array<[string, number]>) => {
            return seats.reduce<Record<string, string[]>>((acc, [label]) => {
                const section = label.split("-")[0];

                if (!acc[section]) {
                    acc[section] = [];
                }

                acc[section].push(label);

                return acc;
            }, {});
        };

        const buildSectionDto = (section: string, seats: string[]): MyEventSeatDTO => {
            return {
                section: seats.length > 1 ? `${section} x${seats.length}` : section,
                seats: seats.join(", ")
            };
        };


        useImperativeHandle(ref, () => ({
            getSelectedSeats: () => selectedSeatsRef.current,
            getSelectedSeatsDto: () => {
                const seats = selectedSeatsRef.current;

                if (!seats.length) {
                    return [];
                }

                return Object.entries(groupSeatsBySection(seats))
                    .map(([section, seats]) => buildSectionDto(section, seats));
            },

            clearSelection: () => {
                if (!chartRef.current) return;

                chartRef.current.deselectObjects(selectedSeatsRef.current.map(s => s[0]));
                selectedSeatsRef.current = [];
                onSeatsChange?.();
            }
        }));

        const handleChartRendered = (chart: SeatingChart) => {
            chartRef.current = chart;

            if (selectedSection) chart.zoomToSection(selectedSection);

            const seedSeats = initialSeats ?? [];

            if (seedSeats.length && initialSelectedSeats) {
                chart.doSelectObjects(initialSelectedSeats);
                chart.zoomToObjects(initialSelectedSeats);
            }

            selectedSeatsRef.current = seedSeats;

            setIsLoading(false);
        };

        const handleSelected = (obj: SelectableObject) => {
            if (selectedSeatsRef.current.some(s => s[0] === obj.label)) return;

            const next: [string, number][] = [
                ...selectedSeatsRef.current,
                [obj.label, getSeatPrice(obj)]
            ];

            selectedSeatsRef.current = next;

            if (mode === "normal") {
                dispatch(setSeats(next));
            }

            onSeatsChange?.();
        };

        const handleDeselected = (obj: SelectableObject) => {
            if (obj.objectType !== "Seat") return;

            const next = selectedSeatsRef.current.filter(s => s[0] !== obj.label);

            selectedSeatsRef.current = next;

            if (mode === "normal") {
                dispatch(setSeats(next));
            }

            onSeatsChange?.();
        };

        const handleHoldTokenExpired = () => {
            // TODO: dispatch expireHoldToken from bookingFlowSlice and surface HoldExpiredModal when seats.io fires onHoldTokenExpired
        };

        const getSeatPrice = (obj: SelectableObject): number => {
            return obj.pricing?.price
                ? Number.parseFloat(obj.pricing.price.toString())
                : 0;
        };

        return (
            <div>
                {chartConfig && (
                    <SeatsioSeatingChart
                        key={`${(!blockSameSeats ? holdToken : "map")}-${JSON.stringify(initialSeats)}`}
                        workspaceKey={process.env.NEXT_PUBLIC_SEATS_WORKSPACE_KEY}
                        holdToken={!blockSameSeats ? holdToken : ""}
                        event={eventKey}
                        region="na"
                        pricing={pricing}
                        mode={mode}
                        showMinimap={mode !== "print"}
                        categoryFilter={categoryFilter}
                        channels={channels}
                        session={session}
                        maxSelectedObjects={orderLeftSeats ? orderLeftSeats : MAX_SEATS_SELECTION}
                        onHoldTokenExpired={handleHoldTokenExpired}
                        onObjectSelected={handleSelected}
                        onObjectDeselected={handleDeselected}
                        onChartRendered={handleChartRendered}
                        objectWithoutPricingSelectable={mode !== "normal"}
                        onRenderStarted={() => setIsLoading(true)}
                        onChartRenderingFailed={() => setIsLoading(false)}
                        extraConfig={{
                            allowedSeats: initialSeats?.map(s => s[0]) ?? [],
                            mapBlockSameSeats: blockSameSeats,
                            mapDisabledSelectedColor: DISABLED_SELECTED_SEAT_COLOR
                        }}
                        objectColor={(object: SelectableObject, defaultColor, extraConfig) => {
                            if (!extraConfig.mapBlockSameSeats) {
                                return defaultColor;
                            }

                            if (!extraConfig.allowedSeats?.length) {
                                return defaultColor;
                            }

                            if (object.objectType === "Seat" && extraConfig.allowedSeats.includes(object.labels.displayedLabel)) {
                                return extraConfig.mapDisabledSelectedColor;
                            }

                            return defaultColor;
                        }}
                        isObjectVisible={(object: SelectableObject, extraConfig) => {
                            if (!extraConfig.mapBlockSameSeats) {
                                return true;
                            }

                            if (!extraConfig.allowedSeats?.length) {
                                return true;
                            }

                            if (object.objectType === "Seat") {
                                return extraConfig.allowedSeats.includes(object.labels.displayedLabel);
                            }

                            return object.objectType === "section";
                        }}
                    />
                )}
                <Loader isLoading={isLoading} />
            </div>
        );
    }
);

SeatsMap.displayName = "SeatsMap";

export default SeatsMap;