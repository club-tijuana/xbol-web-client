"use client";

import { SeatingChart, SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { useAppDispatch } from "@/store/hooks";
import { expireHoldToken } from "@/store/slices/bookingSlice";

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
        selectedSeats,
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
        isRenovation = false,
        onSeatsChange
    }, ref) => {
        const dispatch = useAppDispatch();
        const initializedRef = useRef(false);
        const chartRef = useRef<SeatingChart | null>(null);
        const [isLoading, setIsLoading] = useState(false);
        const [currentSelectedSeats, setCurrentSelectedSeats] = useState<[string, number][]>(selectedSeats ?? []);
        const [currentSelectedSeatsDto, setCurrentSelectedSeatsDto] = useState<MyEventSeatDTO[]>([]);
        const selectedSeatsRef = useRef<Array<[string, number]>>([]);
        const selectedSeatsDtoRef = useRef<MyEventSeatDTO[]>([]);
        const chartConfig = eventKey
            ? { holdToken, eventKey }
            : null;
        const initialSeats: Array<string> | undefined = selectedSeats ? selectedSeats.map(s => s[0]) : undefined;

        useEffect(() => {
            initializedRef.current = false;
        }, [eventKey]);

        useEffect(() => {
            selectedSeatsRef.current = currentSelectedSeats;
            selectedSeatsDtoRef.current = currentSelectedSeatsDto;

            if (onSeatsChange) {
                onSeatsChange();
            }
        }, [currentSelectedSeats, currentSelectedSeatsDto]);

        useImperativeHandle(ref, () => ({
            getSelectedSeats: () => selectedSeatsRef.current,

            getSelectedSeatsDto: () => currentSelectedSeatsDto,

            clearSelection: () => {
                if (!chartRef.current) return;

                chartRef.current.deselectObjects(selectedSeatsRef.current.map(s => s[0]));
                setCurrentSelectedSeats([]);
                setCurrentSelectedSeatsDto([]);
            }
        }));

        const handleChartRendered = (chart: SeatingChart) => {
            chartRef.current = chart;

            if (selectedSection) chart.zoomToSection(selectedSection);
            if (selectedSeats) chart.zoomToObjects(selectedSeats.map(s => s[0]));

            if (!initializedRef.current && selectedSeats && selectedSeats.length > 0) {
                const dtoFromSelected = Object.entries(groupSeatsBySection(selectedSeats))
                    .map(([Selection, seats]) => buildSectionDto(Selection, seats));

                setCurrentSelectedSeatsDto(dtoFromSelected);

                initializedRef.current = true;
            }

            if (initialSeats?.length) {
                chart.doSelectObjects(initialSeats);
                chart.zoomToObjects(initialSeats);
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

            setCurrentSelectedSeatsDto(prev =>
                updateSectionSeats(
                    prev ?? [],
                    obj.labels.section ?? "",
                    obj.labels.displayedLabel,
                    "add"
                )
            );
        };

        const handleDeselected = (obj: SelectableObject) => {
            if (!obj.labels.section) return;

            setCurrentSelectedSeats(prev => prev.filter(s => s[0] !== obj.label));

            setCurrentSelectedSeatsDto(prev =>
                updateSectionSeats(
                    prev ?? [],
                    obj.labels.section ?? "",
                    obj.labels.displayedLabel,
                    "remove"
                )
            );

            if (onSeatsChange) {
                onSeatsChange();
            }
        };

        const handleHoldTokenExpired = () => {
            dispatch(expireHoldToken());
        };

        const getSeatPrice = (obj: SelectableObject): number => {
            return obj.pricing?.price
                ? Number.parseFloat(obj.pricing.price.toString())
                : 0;
        };

        const buildSectionDto = (section: string, seats: string[]): MyEventSeatDTO => {
            return {
                section: seats.length > 1 ? `${section} x${seats.length}` : section,
                seats: seats.join(", ")
            };
        };

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

        const updateSectionSeats = (
            current: MyEventSeatDTO[],
            section: string,
            seatLabel: string,
            action: "add" | "remove"
        ): MyEventSeatDTO[] => {
            const found = current.find(s => s.section.startsWith(section));

            if (!found && action === "add") {
                return [...current, buildSectionDto(section, [seatLabel])];
            }

            if (!found) {
                return current;
            }

            const seatsArray = found.seats.split(",").map(s => s.trim());

            const updatedSeats =
                action === "add"
                    ? [...seatsArray, seatLabel]
                    : seatsArray.filter(s => s !== seatLabel);

            if (updatedSeats.length === 0) {
                return current.filter(s => s.section !== found.section);
            }

            return [
                buildSectionDto(section, updatedSeats),
                ...current.filter(s => s.section !== found.section)
            ];
        };

        return (
            <div>
                {chartConfig && (
                    <SeatsioSeatingChart
                        key={!isRenovation ? holdToken : "map"}
                        workspaceKey={process.env.NEXT_PUBLIC_SEATS_WORKSPACE_KEY}
                        holdToken={!isRenovation ? holdToken : ""}
                        event={eventKey}
                        region="na"
                        pricing={pricing}
                        mode={mode}
                        showMinimap={mode !== "print"}
                        categoryFilter={categoryFilter}
                        channels={channels}
                        session={session}
                        maxSelectedObjects={MAX_SEATS_SELECTION}
                        onHoldTokenExpired={handleHoldTokenExpired}
                        onObjectSelected={handleSelected}
                        onObjectDeselected={handleDeselected}
                        onChartRendered={handleChartRendered}
                        objectWithoutPricingSelectable={mode !== "normal"}
                        onRenderStarted={() => setIsLoading(true)}
                        onChartRenderingFailed={() => setIsLoading(false)}
                        extraConfig={{
                            allowedSeats: initialSeats ?? [],
                            mapIsRenovation: isRenovation,
                            mapDisabledSelectedColor: DISABLED_SELECTED_SEAT_COLOR
                        }}
                        objectColor={(object, defaultColor, extraConfig) => {
                            if (extraConfig.mapIsRenovation) {
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
                        isObjectVisible={(object, extraConfig) => {
                            if (extraConfig.mapIsRenovation) {
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