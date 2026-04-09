"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Alert, AlertColor, Box, Button, Grid, Paper, Snackbar, Typography } from "@mui/material";
import { HoldToken, Pricing } from "@seatsio/seatsio-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader/Loader";
import { formatDate } from "@/helpers/formatDateHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { ItemType } from "@/models/enums/item-type.enum";
import { EventItemDTO } from "@/models/event-item.dto";
import { SeasonItemDTO } from "@/models/season-item.dto";
import { getEventItemBySchedule, getSeasonById } from "@/services/bookingService";
import { holdToken as holdTokenService } from "@/services/holdService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookHoldToken, setBookKey, setBookMode, setBookTicketType, setSeats, setSeatsDto } from "@/store/slices/bookingFlowSlice";
import {
    resetState,
    eventBook,
    seasonBook,
    seasonRenovate
} from "@/store/slices/bookingSlice";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";
import { BookingStep } from "@/types/bookingStep";

import BookingLeftPanel from "../BookingLeftPanel/BookingLeftPanel";
import BookingRightPanel, { BookingRightPanelHandle } from "../BookingRightPanel/BookingRightPanel";
import HoldExpiredModal from "../HoldExpiredModal/HoldExpiredModal";
import HoldTokenTimer from "../HoldTokenTimer/HoldTokenTimer";

import { BookingClientProps } from "./BookingClient.type";

/* -------------------- COMPONENT -------------------- */
export default function BookingClient({ id, bookingMode }: BookingClientProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const mapRef = useRef<BookingRightPanelHandle>(null);

    //const eventBookObj = useAppSelector(state => state.booking.eventBookingRequest);
    //const seasonBookObj = useAppSelector(state => state.booking.seasonBookingRequest);
    const generalMessage = useAppSelector(state => state.ui.generalMessage);
    const bookingState = useAppSelector(state => state.booking.status);
    const initialSeats = useAppSelector(state => state.bookingFlow.initialSeats);
    const selectedSeats = useAppSelector(store => store.bookingFlow.selectedSeats);
    const renovationType = useAppSelector(store => store.bookingFlow.renovationType);
    const clientContactObj = useAppSelector(store => store.bookingFlow.clientContact);

    const [event, setEvent] = useState<EventItemDTO | null>(null);
    const [season, setSeason] = useState<SeasonItemDTO | null>(null);
    const [bookingStep, setBookingStep] = useState<BookingStep>("selection");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [mapKey, setMapKey] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
    const [holdToken, setHoldToken] = useState<string | undefined>(undefined);
    const [sectionsPrices, setSectionsPrices] = useState<Pricing>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        async function loadAll() {
            try {
                setIsLoading(true);
                let holdTokenResponse: HoldToken | undefined;
                if (bookingMode === "event" || bookingMode === "season" || renovationType === "changeSeats") {
                    holdTokenResponse = await holdTokenService();
                }

                let mapKeyLocal = "";

                await dispatch(setBookMode(bookingMode));
                await dispatch(setSeats([]));
                await dispatch(setBookHoldToken({
                    token: '',
                    expiresInSeconds: 0,
                    expiresAt: ''
                }));
                if (bookingMode === "event") {
                    try {
                        const eventResponse = await getEventItemBySchedule(Number.parseInt(id));

                        if (!eventResponse.eventKey) return;

                        mapKeyLocal = eventResponse.eventKey;

                        if (!isMounted) return;

                        setEvent(eventResponse);
                        setFormattedDate(formatDate(eventResponse.startDate, "dateTime"));

                        await dispatch(setBookTicketType(ItemType.Ticket));
                        await dispatch(setBookKey(eventResponse.eventKey));
                    }
                    catch (error) {
                        dispatch(resetState());
                        dispatch(showGeneralMessage({
                            message: getErrorMessage(error),
                            severity: "error"
                        }));
                        router.push("/");
                    }
                }
                else {
                    try {
                        const seasonResponse = await getSeasonById(Number.parseInt(id));

                        if (!seasonResponse.externalSeasonKey) return;

                        mapKeyLocal = seasonResponse.externalSeasonKey;

                        if (!isMounted) return;

                        setSeason(seasonResponse);
                        setFormattedDate(formatDate(seasonResponse.startDate, "dateTime"));

                        await dispatch(setBookTicketType(ItemType.SeasonPass));
                        await dispatch(setBookKey(seasonResponse.externalSeasonKey));
                    }
                    catch (error) {
                        dispatch(resetState());
                        dispatch(showGeneralMessage({
                            message: getErrorMessage(error),
                            severity: "error"
                        }));
                        router.push("/");
                    }
                }

                if (!isMounted) return;

                if (bookingMode === "event" || bookingMode === "season" || renovationType === "changeSeats") {
                    if (holdTokenResponse && holdTokenResponse?.token) {
                        setHoldToken(holdTokenResponse.token);
                        await dispatch(setBookHoldToken(holdTokenResponse));
                    }
                }
                else {
                    setHoldToken("");
                }

                if (bookingMode === "renovateSeason" && renovationType === "changeSeats") {
                    dispatch(setSeats([]));
                }

                setMapKey(mapKeyLocal);

            } catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));

                router.push("/");
            }
            finally {
                setIsLoading(false);
            }
        }

        loadAll();

        return () => {
            isMounted = false;
        };
    }, [id, bookingMode, renovationType, dispatch]);

    const handleContinue = async () => {
        switch (bookingStep) {
            case "selection":
                let seats: [string, number][] | undefined;

                if (bookingMode !== "renovateSeason") {
                    seats = mapRef.current?.getSelectedSeats();
                }
                else {
                    seats = (!initialSeats || initialSeats.length === 0) ? selectedSeats : initialSeats;
                }

                const seatsDto = mapRef.current?.getSelectedSeatsDto();

                if (!seats || seats.length === 0) {
                    setSnackbarSeverity("warning");
                    setSnackbarMessage("Es necesario seleccionar asientos para poder continuar.");
                    setOpenSnackbar(true);
                    return;
                }

                if (seats) {
                    dispatch(setSeats(seats));
                }

                if (seatsDto) {
                    dispatch(setSeatsDto(seatsDto));
                }

                setBookingStep("payment");
                break;
            case "payment":
                if (
                    !clientContactObj?.firstName
                    || !clientContactObj?.lastName
                    || !clientContactObj?.email
                    || !clientContactObj?.phoneNumber
                ) {
                    setSnackbarSeverity("warning");
                    setSnackbarMessage("Es necesario capturar la información del cliente");
                    setOpenSnackbar(true);
                    return;
                }

                if (bookingMode === "event") {
                    const result = await dispatch(eventBook());

                    if (eventBook.fulfilled.match(result)) {
                        await dispatch(resetState());
                        router.push(`/account/tickets/order/${result.payload.orderId}/success`);
                    }
                    else if (eventBook.rejected.match(result)) {
                        const message =
                            (result.payload as string) ||
                            result.error.message ||
                            "Error al reservar el evento";

                        setSnackbarSeverity("error");
                        setSnackbarMessage(message);
                        setOpenSnackbar(true);
                    }
                }
                else if (bookingMode === "season" || bookingMode === "renovateSeason") {
                    if (bookingMode === "season") {
                        const result = await dispatch(seasonBook());

                        if (seasonBook.fulfilled.match(result)) {
                            await dispatch(resetState());
                            router.push(`/account/tickets/order/${result.payload.orderId}/success`);
                        }
                        else if (seasonBook.rejected.match(result)) {
                            const message =
                                (result.payload as string) ||
                                result.error.message ||
                                "Error al reservar la temporada";

                            setSnackbarSeverity("error");
                            setSnackbarMessage(message);
                            setOpenSnackbar(true);
                        }
                    }
                    else if (bookingMode === "renovateSeason") {
                        const result = await dispatch(seasonRenovate());

                        if (seasonRenovate.fulfilled.match(result)) {
                            await dispatch(resetState());
                            router.push(`/account/tickets/order/${result.payload.orderId}/success`);
                        }
                        else if (seasonRenovate.rejected.match(result)) {
                            const message =
                                (result.payload as string) ||
                                result.error.message ||
                                "Error al renovar la temporada";

                            setSnackbarSeverity("error");
                            setSnackbarMessage(message);
                            setOpenSnackbar(true);
                        }
                    }
                }
                break;
        }

    };

    return (
        <Grid container columns={12} mt={7} spacing={4} pb={8} sx={{ minHeight: "100vh", alignContent: "start" }}>
            {holdToken &&
                <Grid size={12}>
                    <HoldTokenTimer />
                </Grid>
            }
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
                {((bookingMode === "season" || bookingMode === "renovateSeason") && season) &&
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
                <BookingLeftPanel
                    mapKey={mapKey}
                    scheduleId={bookingMode === "event" ? Number(id) : undefined}
                    seasonId={bookingMode !== "event" ? Number(id) : undefined}
                    bookingStep={bookingStep}
                    onSectionSelected={(section) => { setSelectedSection(section); }}
                    onSectionsChange={setSectionsPrices}
                />
            </Grid>
            <Grid size={6}>
                <Paper elevation={3} className="paperCard" sx={{ backgroundColor: "white" }}>
                    <BookingRightPanel
                        ref={mapRef}
                        holdToken={holdToken}
                        mapKey={mapKey}
                        bookingMode={bookingMode}
                        bookingStep={bookingStep}
                        selectedSection={selectedSection}
                        sectionsPrices={sectionsPrices}
                        onPay={handleContinue}
                    />
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

            <HoldExpiredModal />
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

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={!!generalMessage.message}
                autoHideDuration={4000}
                onClose={() => dispatch(clearGeneralMessage())}>
                <Alert
                    severity={generalMessage.severity}
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {generalMessage.message}
                </Alert>
            </Snackbar>
            <Loader isLoading={(bookingState === "loading" || isLoading)} />
        </Grid>
    );
}