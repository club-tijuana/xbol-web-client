"use client";

import { SeatingChart, SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { publicEnv } from "@/config/env";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSeats } from "@/store/slices/bookingFlowSlice";

import Loader from "../Loader/Loader";

import { SeatsMapProps } from "./SeatsMap.type";

/* -------------------- CONSTANTS -------------------- */
const MAX_SEATS_SELECTION: number = 12;
const DISABLED_SELECTED_SEAT_COLOR: string = "#F85E30";

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
        const initSeats = useAppSelector(store => store.bookingFlow.initialSeats);
        const orderLeftSeats = useAppSelector(store => store.bookingFlow.orderLeftSeats);
        const initializedRef = useRef(false);
        const chartRef = useRef<SeatingChart | null>(null);
        const [isLoading, setIsLoading] = useState(false);
        const [currentSelectedSeats, setCurrentSelectedSeats] = useState<[string, number][]>(initialSeats ?? []);
        const selectedSeatsRef = useRef<Array<[string, number]>>([]);
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

        useEffect(() => {
            initializedRef.current = false;
        }, [eventKey]);

        useEffect(() => {
            selectedSeatsRef.current = currentSelectedSeats;

            if (onSeatsChange) {
                onSeatsChange();
            }
        }, [currentSelectedSeats]);

        useEffect(() => {
            if (!chartRef.current) return;

            const newSeats = initSeats ?? [];

            chartRef.current.clearSelection?.();
            chartRef.current.deselectObjects(
                currentSelectedSeats.map(s => s[0])
            );

            if (newSeats.length) {
                chartRef.current.doSelectObjects(newSeats.map(s => s[0]));
            }

            setCurrentSelectedSeats(newSeats);

        }, [initSeats]);

        useEffect(() => {
            if (chartRef && chartRef.current && selectedSection) {
                chartRef.current.zoomToSection(selectedSection);
            }
        }, [selectedSection]);

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
                setCurrentSelectedSeats([]);
            }
        }));

        const handleChartRendered = (chart: SeatingChart) => {
            chartRef.current = chart;

            if (selectedSection) chart.zoomToSection(selectedSection);
            //if (initialSeats) chart.zoomToObjects(initialSeats.map(s => s[0]));

            if (!initializedRef.current && initialSeats && initialSeats.length > 0) {
                initializedRef.current = true;
            }

            if (initialSeats?.length && initialSelectedSeats) {
                chart.doSelectObjects(initialSelectedSeats).catch(() => { });
                chart.zoomToObjects(initialSelectedSeats);
            }

            setIsLoading(false);
        };

        const handleSelected = (obj: SelectableObject) => {
            const seatLabels = currentSelectedSeats.map(s => s[0]);

            if (seatLabels?.includes(obj.label)) return;

            setCurrentSelectedSeats(prev => [...prev, [
                obj.label,
                getSeatPrice(obj)
            ]]);

            if (mode === "normal") {
                dispatch(setSeats([...currentSelectedSeats, [obj.label, getSeatPrice(obj)]]));
            }
        };

        const handleDeselected = (obj: SelectableObject) => {
            if (!obj.labels.section) return;

            setCurrentSelectedSeats(prev => prev.filter(s => s[0] !== obj.label));

            if (mode === "normal") {
                dispatch(setSeats([...currentSelectedSeats.filter(s => s[0] !== obj.label)]));
            }
            if (onSeatsChange) {
                onSeatsChange();
            }
        };

        const handleHoldTokenExpired = () => {
            //dispatch(expireHoldToken());
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
                        key={`${(!blockSameSeats ? holdToken : "map")}-${JSON.stringify(initSeats)}`}
                        workspaceKey={publicEnv.NEXT_PUBLIC_SEATS_WORKSPACE_KEY}
                        holdToken={(!blockSameSeats && mode !== "print") ? holdToken : ""}
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
                            mapDisabledSelectedColor: DISABLED_SELECTED_SEAT_COLOR,
                            viewMode: mode
                        }}
                        objectColor={(object: any, defaultColor, extraConfig) => {
                            if (extraConfig.mapBlockSameSeats || extraConfig.viewMode === "print") {
                                const type =
                                    typeof object.objectType === "function"
                                        ? object.objectType()
                                        : object.objectType;

                                if (!extraConfig.allowedSeats?.length) {
                                    return defaultColor;
                                }

                                if (type === "Seat" && extraConfig.allowedSeats.includes(object.labels.displayedLabel)) {
                                    return extraConfig.mapDisabledSelectedColor;
                                }

                                return defaultColor;
                            }
                            else {
                                return defaultColor;
                            }
                        }}
                        isObjectVisible={(object: any, extraConfig) => {
                            if (extraConfig.mapBlockSameSeats) {
                                const type =
                                    typeof object.objectType === "function"
                                        ? object.objectType()
                                        : object.objectType;

                                if (!extraConfig.allowedSeats?.length) {
                                    return true;
                                }

                                if (type === "Seat") {
                                    return extraConfig.allowedSeats.includes(object.labels.displayedLabel);
                                }

                                return type === "row" || type === "section";
                            }
                            else {
                                return true;
                            }
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
