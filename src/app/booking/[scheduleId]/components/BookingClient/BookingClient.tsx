"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { SelectableObject } from "@seatsio/seatsio-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import TicketSeats from "@/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketSeats/TicketSeats";
import SeatsMap from "@/components/SeatsMap/SeatsMap";
import { formatDate } from "@/helpers/formatDateHelper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setEventId, setSeatsDto, setSeats } from "@/store/slices/bookingSlice";

import Payment from "../Payment/Payment";
import SeatFilters from "../SeatFilters/SeatFilters";

import { BookingClientProps } from "./BookingClient.type";

/* -------------------- STEPS -------------------- */
type BookingStep = "selection" | "payment";

/* -------------------- COMPONENT -------------------- */
export default function BookingClient({ scheduleId, event }: BookingClientProps) {
    const [bookingStep, setBookingStep] = useState<BookingStep>("selection");
    const selectedSeatsDto = useAppSelector(store => store.booking.selectedSeatsDto);
    const selectedSeats = useAppSelector(store => store.booking.selectedSeats);
    const dispatch = useAppDispatch();
    const [selectedSection, setSelectedSection] = useState("");

    const formattedDate = formatDate(event.startDate, "dateTime");

    useEffect(() => {
        dispatch(setEventId(event.id));
    }, [event, dispatch]);

    const renderLeftPanel = () => {
        switch (bookingStep) {
            case "selection":
                return (
                    <SeatFilters
                        scheduleId={Number(scheduleId)}
                        onSectionSelected={(section) => { setSelectedSection(section); }}
                    />
                );
            case "payment":
                return event.eventKey && selectedSeatsDto ? (
                    <TicketSeats
                        eventKey={event.eventKey}
                        seats={selectedSeatsDto}
                        selectedSeats={selectedSeats}
                    />
                ) : null;
            default:
                return null;
        };
    };

    const renderRightPanel = () => {
        switch (bookingStep) {
            case "selection":
                return event && event.eventKey ? (
                    <SeatsMap
                        selectedSection={selectedSection}
                        selectedObjects={selectedSeats}
                        onSelected={handleSeatSelect}
                        onDeselected={handleSeatDeselect}
                        eventKey={event.eventKey}
                    />
                ) : null;
            case "payment":
                return (
                    <Payment
                        subtotal={0}
                        taxes={0}
                        total={0}
                        currency="MXN"
                    />
                );
            default:
                return null;
        }
    };

    const handleSeatSelect = (seat: SelectableObject) => {
        if (!seat.labels.section) return;
        if (selectedSeats?.includes(seat.label)) return;

        dispatch(setSeats(
            Array.from(new Set([...(selectedSeats ?? []), seat.label]))
        ));

        const current = selectedSeatsDto ?? [];
        const sectionFound = current.find(s => s.section.startsWith(seat.labels.section ?? ""));

        if (sectionFound) {
            const updatedSeats = sectionFound.seats
                ? `${sectionFound.seats},${seat.labels.own}`
                : seat.labels.own;

            const sectionName = updatedSeats.split(",").length > 1
                ? `${seat.labels.section} x${updatedSeats.split(",").length}`
                : seat.labels.section;

            dispatch(setSeatsDto([
                { section: sectionName, seats: updatedSeats },
                ...current.filter(s => s.section !== sectionFound.section)
            ]));
        } else {
            dispatch(setSeatsDto([
                ...current,
                { section: seat.labels.section, seats: seat.labels.own }
            ]));
        }
    };

    const handleSeatDeselect = (seat: SelectableObject) => {
        if (!seat.labels.section) return;

        if (selectedSeats) {
            dispatch(setSeats(
                selectedSeats.filter(s => s !== seat.label)
            ));
        }

        const current = selectedSeatsDto ?? [];
        const sectionFound = current.find(s => s.section.startsWith(seat.labels.section ?? ""));

        if (!sectionFound) return;

        const seatsArray = sectionFound.seats.split(",").map(s => s.trim());
        const updatedSeatsArray = seatsArray.filter(s => s !== seat.labels.own);

        if (updatedSeatsArray.length === 0) {
            dispatch(setSeatsDto(current.filter(s => s.section !== sectionFound.section)));
        }
        else {
            const sectionName = updatedSeatsArray.length > 1
                ? `${seat.labels.section} x${updatedSeatsArray.length}`
                : seat.labels.section;

            dispatch(setSeatsDto([
                { section: sectionName, seats: updatedSeatsArray.join(",") },
                ...current.filter(s => s.section !== sectionFound.section)
            ]));
        }
    }

    return (
        <Grid container columns={12} mt={7}>
            <Grid size={6}>
                <Grid container columns={12}>
                    <Grid size={4}>
                        <Box sx={{
                            position: "relative",
                            height: 126
                        }}>
                            <Image
                                src={event.posterImageUrl}
                                alt="Evento"
                                fill
                                style={{ objectFit: 'cover', borderRadius: 10 }}
                            />
                        </Box>
                    </Grid>
                    <Grid size={7} display={"flex"} flexDirection={"column"} pl={4}>
                        <Typography variant="hero" color="primary">
                            {event.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight={400}
                            color="text"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                            <CalendarTodayOutlined color="primary" />
                            {formattedDate}
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight={400}
                            color="text"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                            <LocationOnOutlined color="primary" />
                            {event.location}
                        </Typography>
                    </Grid>
                </Grid>
                {renderLeftPanel()}
            </Grid>
            <Grid size={6}>
                {renderRightPanel()}

                <Button variant="contained" color="primary" onClick={() => setBookingStep("payment")}>
                    <Typography variant="body1" color="neutral">
                        Continuar
                    </Typography>
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setBookingStep("selection")}>
                    <Typography variant="body1" color="text">
                        Regresar
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
}