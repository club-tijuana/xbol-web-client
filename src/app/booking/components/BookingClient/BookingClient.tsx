"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Alert, AlertColor, Box, Button, Grid, Paper, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import TicketSeats from "@/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketSeats/TicketSeats";
import Loader from "@/components/Loader/Loader";
import SeatsMap, { SeatsMapHandle } from "@/components/SeatsMap/SeatsMap";
import { formatDate } from "@/helpers/formatDateHelper";
import { ItemType } from "@/models/enums/item-type.enum";
import { EventItemDTO } from "@/models/event-item.dto";
import { SeasonItemDTO } from "@/models/season-item.dto";
import { getEventItemBySchedule, getSeasonById } from "@/services/bookingService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    resetState,
    setBookHoldToken,
    setBookKey,
    setBookMode,
    setBookSeats,
    setBookTicketType,
    setSeats,
    setSeatsDto,
    eventBook,
    setBookScheduleId,
    seasonBook
} from "@/store/slices/bookingSlice";

import ClientInfo from "../ClientInfo/ClientInfo";
import Payment from "../Payment/Payment";
import SeatFilters from "../SeatFilters/SeatFilters";

import { BookingClientProps } from "./BookingClient.type";

/* -------------------- STEPS -------------------- */
type BookingStep = "selection" | "payment";

/* -------------------- COMPONENT -------------------- */
export default function BookingClient({ id, bookingMode }: BookingClientProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const mapRef = useRef<SeatsMapHandle>(null);

    const eventBookObj = useAppSelector(state => state.booking.eventBookingRequest);
    const seasonBookObj = useAppSelector(state => state.booking.seasonBookingRequest);
    const bookingState = useAppSelector(state => state.booking.status);
    const selectedSeatsDto = useAppSelector(store => store.booking.selectedSeatsDto);
    const selectedSeats = useAppSelector(store => store.booking.selectedSeats);

    const [event, setEvent] = useState<EventItemDTO | null>(null);
    const [season, setSeason] = useState<SeasonItemDTO | null>(null);
    const [bookingStep, setBookingStep] = useState<BookingStep>("selection");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [mapKey, setMapKey] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");

    useEffect(() => {
        dispatch(resetState());
        dispatch(setBookMode(bookingMode));

        async function load() {
            if (bookingMode === "event") {
                const eventResponse = await getEventItemBySchedule(Number.parseInt(id));

                if (!eventResponse.eventKey) {
                    // TODO: Redirect to event page and show message
                    return;
                }

                setEvent(eventResponse);
                setFormattedDate(formatDate(eventResponse.startDate, "dateTime"));
                setMapKey(eventResponse.eventKey);

                dispatch(setBookTicketType(ItemType.Ticket));
                dispatch(setBookKey(eventResponse.eventKey));
                dispatch(setBookScheduleId(Number.parseInt(id)));
                dispatch(setBookHoldToken("aaaaaaaaa"));
            }
            else if (bookingMode === "season") {
                const seasonResponse = await getSeasonById(Number.parseInt(id));

                if (!seasonResponse.externalSeasonKey) {
                    // TODO: Redirect to event page and show message
                    return;
                }

                setSeason(seasonResponse);
                setFormattedDate(formatDate(seasonResponse.startDate, "dateTime"));
                setMapKey(seasonResponse.externalSeasonKey);

                dispatch(setBookTicketType(ItemType.SeasonPass));
                dispatch(setBookKey(seasonResponse.externalSeasonKey));
                dispatch(setBookScheduleId(Number.parseInt(id)));
                dispatch(setBookHoldToken("aaaaaaaaa"));
            }
        };

        load();
    }, [dispatch, id, bookingMode]);

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

    const renderLeftPanel = () => {
        switch (bookingStep) {
            case "selection":
                return (
                    <SeatFilters
                        scheduleId={Number(id)}
                        onSectionSelected={(section) => { setSelectedSection(section); }}
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

    const renderRightPanel = () => {
        switch (bookingStep) {
            case "selection":
                return ((event && event.eventKey) || (season && season.externalSeasonKey)) ? (
                    <SeatsMap
                        ref={mapRef}
                        selectedSection={selectedSection}
                        selectedSeats={selectedSeats}
                        eventKey={mapKey}
                        pricing={[{ category: 3, price: 1 }, { category: 4, price: 2 }, { category: 5, price: 3 }]}
                    />
                ) : null;
            case "payment":
                return (
                    <Payment
                        subtotal={subtotal}
                        taxes={taxes}
                        total={total}
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
                if (bookingMode === "event") {
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

                    const result = await dispatch(eventBook(eventBookObj));

                    if (eventBook.fulfilled.match(result)) {
                        router.push(`/account/tickets/order/${result.payload.orderId}/success`);
                    }
                    else if (eventBook.rejected.match(result)) {
                        // TODO: Handle error
                    }
                }
                else if (bookingMode === "season") {
                    if (
                        !seasonBookObj?.clientContact?.firstName
                        || !seasonBookObj?.clientContact?.lastName
                        || !seasonBookObj?.clientContact?.email
                        || !seasonBookObj?.clientContact?.phoneNumber
                    ) {
                        setSnackbarSeverity("warning");
                        setSnackbarMessage("Es necesario capturar la información del cliente");
                        setOpenSnackbar(true);
                        return;
                    }

                    const result = await dispatch(seasonBook(seasonBookObj));

                    if (seasonBook.fulfilled.match(result)) {
                        router.push(`/account/tickets/order/${result.payload.orderId}/success`);
                    }
                    else if (seasonBook.rejected.match(result)) {
                        // TODO: Handle error
                    }
                }
                break;
        }

    };

    return (
        <Grid container columns={12} mt={7} spacing={4} pb={8}>
            <Grid size={6}>
                {(bookingMode === "event" && event) &&
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
                }
                {(bookingMode === "season" && season) &&
                    <Box mb={2} sx={{
                        position: "relative",
                        height: 180,
                    }}>
                        <Image
                            src={season.bannerImageUrl}
                            alt="Season"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </Box>
                }
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