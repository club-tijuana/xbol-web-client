"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Alert, AlertColor, Box, Button, Grid, Paper, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import TicketSeats from "@/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketSeats/TicketSeats";
import Loader from "@/components/Loader/Loader";
import SeatsMap, { SeatsMapHandle } from "@/components/SeatsMap/SeatsMap";
import { formatDate } from "@/helpers/formatDateHelper";
import { ItemType } from "@/models/enums/item-type.enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookHoldToken, setBookKey, setBookMode, setBookSeats, setBookTicketType, setSeats, setSeatsDto, eventBook, setBookScheduleId } from "@/store/slices/bookingSlice";

import ClientInfo from "../ClientInfo/ClientInfo";
import Payment from "../Payment/Payment";
import SeatFilters from "../SeatFilters/SeatFilters";

import { BookingClientProps } from "./BookingClient.type";

/* -------------------- STEPS -------------------- */
type BookingStep = "selection" | "payment";

/* -------------------- COMPONENT -------------------- */
export default function BookingClient({ scheduleId, event }: BookingClientProps) {
    const router = useRouter();
    const eventBookObj = useAppSelector(state => state.booking.eventBookingRequest);
    const bookingState = useAppSelector(state => state.booking.status);
    const selectedSeatsDto = useAppSelector(store => store.booking.selectedSeatsDto);
    const selectedSeats = useAppSelector(store => store.booking.selectedSeats);

    const mapRef = useRef<SeatsMapHandle>(null);
    const [bookingStep, setBookingStep] = useState<BookingStep>("selection");
    const dispatch = useAppDispatch();
    const [selectedSection, setSelectedSection] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");

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
            dispatch(setBookScheduleId(Number.parseInt(scheduleId)));
            dispatch(setBookHoldToken("aaaaaaaaaaaa")); // TODO: Get hold token from API
            dispatch(setBookTicketType(ItemType.Ticket)); // TODO: Handle Event and Season
        }
    }, [event, dispatch, scheduleId]);

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
                        onPay={handleContinue}
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

                if (!seats || seats.length === 0) {
                    setSnackbarSeverity("warning");
                    setSnackbarMessage("Es necesario seleccionar asientos para poder continuar.");
                    setOpenSnackbar(true);
                    return;
                }

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
                if (
                    !eventBookObj?.clientContact?.firstName
                    || !eventBookObj?.clientContact?.lastName
                    || !eventBookObj?.clientContact?.email
                    || !eventBookObj?.clientContact?.phoneNumber
                ) {
                    setSnackbarSeverity("warning");
                    setSnackbarMessage("Es necesario capturar la información del cliente");
                    setOpenSnackbar(true);
                    return;
                }

                if (eventBookObj) {
                    const result = await dispatch(eventBook(eventBookObj));

                    if (eventBook.fulfilled.match(result)) {
                        router.push(`/account/tickets/order/${result.payload.orderId}/success`);
                    }
                    else if (eventBook.rejected.match(result)) {
                        // TODO: Handle error
                    }
                }
                break;
        }

    };

    return (
        <Grid container columns={12} mt={7} spacing={4} pb={8}>
            <Grid size={6}>
                <Grid container columns={12} mb={4}>
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
                <Paper elevation={3} className="paperCard" sx={{ backgroundColor: "white" }}>
                    {renderRightPanel()}
                </Paper>
                <Box mt={2} textAlign="end">
                    {bookingStep !== "selection" &&
                        <Button variant="outlined" color="secondary"
                            onClick={() => setBookingStep("selection")} sx={{ mr: 2 }}>
                            <Typography variant="body1" color="text">
                                Regresar
                            </Typography>
                        </Button>
                    }
                    {
                        bookingStep !== "payment" &&
                        <Button variant="contained" color="primary" onClick={handleContinue}>
                            <Typography variant="body1" color="neutral">
                                Continuar
                            </Typography>
                        </Button>
                    }
                </Box>
            </Grid>

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSnackbar}
                autoHideDuration={5000}>
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Loader isLoading={bookingState === "loading"} />
        </Grid>
    );
}