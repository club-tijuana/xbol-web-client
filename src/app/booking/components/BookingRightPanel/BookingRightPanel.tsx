"use client";

import { Box, Button, Typography } from "@mui/material";
import { Pricing } from "@seatsio/seatsio-react";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";

import SeatsMap, { SeatsMapHandle } from "@/components/SeatsMap/SeatsMap";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRenovationType } from "@/store/slices/bookingFlowSlice";
import { BookingMode } from "@/types/bookingMode";
import { BookingStep } from "@/types/bookingStep";

import MapSummary from "../MapSummary/MapSummary";
import Payment from "../Payment/Payment";

export interface BookingRightPanelHandle {
    getSelectedSeats: () => Array<BookingSeatRequest>;
    getSelectedSeatsDto: () => MyEventSeatDTO[];
    clearSelection: () => void;
}

interface BookingRightPanelProps {
    mapKey: string;
    bookingMode: BookingMode;
    bookingStep: BookingStep;
    selectedZone?: string;
    zonesPrices: Pricing | undefined;
    isRenewalWindow?: boolean;
    scheduleId?: number;
    onPay?: () => void;
}

const BookingRightPanel = forwardRef<BookingRightPanelHandle, BookingRightPanelProps>(
    (
        {
            mapKey,
            bookingMode,
            bookingStep,
            selectedZone,
            zonesPrices,
            isRenewalWindow = false,
            scheduleId,
            onPay
        },
        ref
    ) => {
        const mapRef = useRef<SeatsMapHandle>(null);
        const dispatch = useAppDispatch();

        const initialSeats = useAppSelector(store => store.bookingFlow.initialSeats);
        const selectedSeats = useAppSelector(store => store.bookingFlow.selectedSeats);
        const renovationType = useAppSelector(store => store.bookingFlow.renovationType);

        const [mapSelectionSummary, setMapSelectionSummary] = useState<BookingSeatRequest[] | undefined>();

        useImperativeHandle(ref, () => ({
            getSelectedSeats: () => mapRef.current?.getSelectedSeats() ?? [],
            getSelectedSeatsDto: () => mapRef.current?.getSelectedSeatsDto() ?? [],
            clearSelection: () => mapRef.current?.clearSelection()
        }));

        const { subtotal, taxes, total } = useMemo(() => {
            let _subtotal = 0;
            const _taxes = 0;
            let _total = 0;

            /* if (initialSeats && initialSeats.length > 0) {
                initialSeats?.forEach(s => {
                    _subtotal += s[1];
                    _total += s[1];
                });
            }
            else {
                selectedSeats?.forEach(s => {
                    _subtotal += s[1];
                    _total += s[1];
                });
            } */
            selectedSeats?.forEach(s => {
                _subtotal += s.seatPrice;
                _total += s.seatPrice;
            });

            return {
                subtotal: _subtotal,
                taxes: _taxes,
                total: _total
            };
        }, [initialSeats, selectedSeats]);

        const handleOnMapSeatChange = () => {
            if (mapRef.current) {
                const seats = mapRef.current.getSelectedSeats();
                setMapSelectionSummary(seats);
            }
            else {
                setMapSelectionSummary([]);
            }
        };

        const handleSetSeats = () => {
            setMapSelectionSummary([]);
            dispatch(setRenovationType("changeSeats"));
        };

        const renderContent = () => {
            switch (bookingStep) {
                case "selection":
                    return (mapKey) ? (
                        <Box>
                            <SeatsMap
                                ref={mapRef}
                                selectedZone={selectedZone}
                                initialSeats={initialSeats}
                                eventKey={mapKey}
                                pricing={zonesPrices}
                                blockSameSeats={
                                    bookingMode === "renovateSeason"
                                    && renovationType === "sameSeats"
                                }
                                isRenewalWindow={isRenewalWindow}
                                onSeatsChange={handleOnMapSeatChange}
                            />
                            {(
                                bookingMode === "renovateSeason"
                                && renovationType === "sameSeats"
                                && !isRenewalWindow
                            ) &&
                                <Box textAlign="center">
                                    <Button variant="contained" sx={{ py: 1.3, px: 4, mt: 3 }} onClick={handleSetSeats}>
                                        <Typography variant="body2" color="neutral">
                                            Cambiar asientos
                                        </Typography>
                                    </Button>
                                </Box>
                            }
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
                            scheduleId={scheduleId}
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