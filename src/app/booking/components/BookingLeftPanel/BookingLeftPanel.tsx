"use client";

import { Box } from "@mui/material";
import { Pricing } from "@seatsio/seatsio-react";

import TicketSeats from "@/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketSeats/TicketSeats";
import { useAppSelector } from "@/store/hooks";
import { BookingStep } from "@/types/bookingStep";

import ClientInfo from "../ClientInfo/ClientInfo";
import SeatFilters from "../SeatFilters/SeatFilters";

interface BookingLeftPanelProps {
    mapKey: string;
    scheduleId?: number;
    seasonId?: number;
    bookingStep: BookingStep;

    onSectionSelected?: (section: string) => void;
    onSectionsChange?: (pricing: Pricing) => void;
}

export default function BookingLeftPanel({ mapKey, scheduleId, seasonId, bookingStep, onSectionSelected, onSectionsChange }: BookingLeftPanelProps) {
    const selectedSeatsDto = useAppSelector(store => store.bookingFlow.selectedSeatsDto);
    const selectedSeats = useAppSelector(store => store.bookingFlow.selectedSeats);

    const renderContent = () => {
        switch (bookingStep) {
            case "selection":
                return (
                    <SeatFilters
                        scheduleId={scheduleId}
                        seasonId={seasonId}
                        onSectionSelected={onSectionSelected}
                        onSectionsChange={onSectionsChange}
                        buttonText="Ver"
                    />
                );
            case "payment":
                return (mapKey && selectedSeatsDto) ? (
                    <>
                        <Box>
                            <TicketSeats
                                eventKey={mapKey}
                                seats={selectedSeatsDto}
                                selectedSeats={selectedSeats}
                            />
                        </Box>
                        <Box mt={4}>
                            <ClientInfo />
                        </Box>
                    </>
                ) : null;
            default:
                return null;
        };
    };

    return renderContent();
}