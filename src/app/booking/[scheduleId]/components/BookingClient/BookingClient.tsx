"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import TicketSeats from "@/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketSeats/TicketSeats";
import SeatsMap, { SeatsMapHandle } from "@/components/SeatsMap/SeatsMap";
import { formatDate } from "@/helpers/formatDateHelper";
import { ItemType } from "@/models/enums/item-type.enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookHoldToken, setBookKey, setBookMode, setBookSeats, setBookTicketType, setSeats, setSeatsDto, eventBook } from "@/store/slices/bookingSlice";

import ClientInfo from "../ClientInfo/ClientInfo";
import Payment from "../Payment/Payment";
import SeatFilters from "../SeatFilters/SeatFilters";

import { BookingClientProps } from "./BookingClient.type";

/* -------------------- STEPS -------------------- */
type BookingStep = "selection" | "payment";

/* -------------------- COMPONENT -------------------- */
export default function BookingClient({ scheduleId, event }: BookingClientProps) {
    const eventBookObj = useAppSelector(state => state.booking.eventBookingRequest);
    const mapRef = useRef<SeatsMapHandle>(null);
    const [bookingStep, setBookingStep] = useState<BookingStep>("selection");
    const selectedSeatsDto = useAppSelector(store => store.booking.selectedSeatsDto);
    const selectedSeats = useAppSelector(store => store.booking.selectedSeats);
    const dispatch = useAppDispatch();
    const [selectedSection, setSelectedSection] = useState("");

    const formattedDate = formatDate(event.startDate, "dateTime");

    useEffect(() => {
        // TODO: Handle Event and Season booking
        if (!event.eventKey) {
            // TODO: Redirect to event page and show a message
        }
        else {
            dispatch(setBookMode("event")); // TODO: Handle Event and Season
            dispatch(setBookTicketType(ItemType.Ticket));
            dispatch(setBookKey(event.eventKey));
            dispatch(setBookHoldToken("aaaaaaaaaaaa")); // TODO: Get hold token from API
            dispatch(setBookTicketType(ItemType.Ticket)); // TODO: Handle Event and Season
        }
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
                    <>
                        <Box>
                            <TicketSeats
                                eventKey={event.eventKey}
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

    const renderRightPanel = () => {
        switch (bookingStep) {
            case "selection":
                return event && event.eventKey ? (
                    <SeatsMap
                        ref={mapRef}
                        selectedSection={selectedSection}
                        selectedSeats={selectedSeats}
                        eventKey={event.eventKey}
                        pricing={[{ category: 3, price: 1 }, { category: 4, price: 2 }, { category: 5, price: 3 }]}
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

    const handleContinue = async () => {
        switch (bookingStep) {
            case "selection":
                const seats = mapRef.current?.getSelectedSeats();
                const seatsDto = mapRef.current?.getSelectedSeatsDto();

                if (seats) {
                    dispatch(setSeats(seats));
                    dispatch(setBookSeats(seats));
                }

                if (seatsDto) {
                    dispatch(setSeatsDto(seatsDto));
                }

                setBookingStep("payment");
                break;
            case "payment":
                if (eventBookObj) {
                    const result = await dispatch(eventBook(eventBookObj));

                    if (eventBook.fulfilled.match(result)) {

                    }
                    else if (eventBook.rejected.match(result)) {

                    }
                }
                break;
        }

    };

    return (
        <Grid container columns={12} mt={7} spacing={4}>
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

                <Button variant="contained" color="primary" onClick={handleContinue}>
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