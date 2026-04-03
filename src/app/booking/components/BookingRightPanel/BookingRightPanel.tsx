"use client";

import { Box } from "@mui/material";
import { Pricing } from "@seatsio/seatsio-react";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";

import SeatsMap, { SeatsMapHandle } from "@/components/SeatsMap/SeatsMap";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { useAppSelector } from "@/store/hooks";
import { BookingMode } from "@/types/bookingMode";
import { BookingStep } from "@/types/bookingStep";

import MapSummary from "../MapSummary/MapSummary";
import Payment from "../Payment/Payment";

export interface BookingRightPanelHandle {
    getSelectedSeats: () => Array<[string, number]>;
    getSelectedSeatsDto: () => MyEventSeatDTO[];
    clearSelection: () => void;
}

interface BookingRightPanelProps {
    holdToken: string | undefined;
    mapKey: string;
    bookingMode: BookingMode
    bookingStep: BookingStep;
    selectedSection: string;
    sectionsPrices: Pricing | undefined;
    onPay?: () => void;
}

const BookingRightPanel = forwardRef<BookingRightPanelHandle, BookingRightPanelProps>(
    (
        {
            holdToken,
            mapKey,
            bookingMode,
            bookingStep,
            selectedSection,
            sectionsPrices,
            onPay
        },
        ref
    ) => {
        const mapRef = useRef<SeatsMapHandle>(null);

        const selectedSeats = useAppSelector(store => store.booking.selectedSeats);

        const [mapSelectionSummary, setMapSelectionSummary] = useState<[string, number][] | undefined>();

        useImperativeHandle(ref, () => ({
            getSelectedSeats: () => mapRef.current?.getSelectedSeats() ?? [],
            getSelectedSeatsDto: () => mapRef.current?.getSelectedSeatsDto() ?? [],
            clearSelection: () => mapRef.current?.clearSelection()
        }));

        const { subtotal, taxes, total } = useMemo(() => {
            let _subtotal = 0;
            const _taxes = 0;
            let _total = 0;

            selectedSeats?.forEach(s => {
                _subtotal += s[1];
                _total += s[1];
            });

            return {
                subtotal: _subtotal,
                taxes: _taxes,
                total: _total
            };
        }, [selectedSeats]);

        const handleOnMapSeatChange = () => {
            if (mapRef.current) {
                const seats = mapRef.current.getSelectedSeats();
                setMapSelectionSummary(seats);
            }
        };

        const renderContent = () => {
            switch (bookingStep) {
                case "selection":
                    return (holdToken !== undefined && mapKey) ? (
                        <Box>
                            <SeatsMap
                                ref={mapRef}
                                selectedSection={selectedSection}
                                selectedSeats={selectedSeats}
                                eventKey={mapKey}
                                holdToken={bookingMode !== "renovateSeason" ? holdToken : ""}
                                pricing={sectionsPrices}
                                session={bookingMode === "renovateSeason" ? "none" : "manual"}
                                isRenovation={bookingMode === "renovateSeason"}
                                onSeatsChange={handleOnMapSeatChange}
                            />
                            {(mapSelectionSummary && mapSelectionSummary.length > 0) &&
                                <MapSummary seats={mapSelectionSummary} />
                            }
                        </Box>
                    ) : null;
                case "payment":
                    return (
                        <Payment
                            subtotal={subtotal}
                            taxes={taxes}
                            total={total}
                            currency="MXN"
                            onPay={onPay}
                        />
                    );
                default:
                    return null;
            }
        };

        return renderContent();
    });

BookingRightPanel.displayName = "BookingRightPanel";

export default BookingRightPanel;