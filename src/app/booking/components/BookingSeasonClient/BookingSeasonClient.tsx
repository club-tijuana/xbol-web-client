"use client";

import { Alert, AlertColor, Box, Button, Grid, Paper, Snackbar, Typography } from "@mui/material";
import { Pricing } from "@seatsio/seatsio-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import TicketSeats from "@/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketSeats/TicketSeats";
import Loader from "@/components/Loader/Loader";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { ItemType } from "@/models/enums/item-type.enum";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { HoldSeatsActionRequest } from "@/models/requests/hold-seats-action-request.dto";
import { SeasonItemDTO } from "@/models/season-item.dto";
import { getSeasonById } from "@/services/bookingService";
import { holdSeats } from "@/services/holdService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearHoldToken, expireHoldToken, resetState, setBookHoldToken, setBookKey, setBookTicketType, setRenovationType, setSeats } from "@/store/slices/bookingFlowSlice";
import { seasonBook, seasonRenovate } from "@/store/slices/bookingSlice";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";
import { BookingStep } from "@/types/bookingStep";

import BookingRightPanel, { BookingRightPanelHandle } from "../BookingRightPanel/BookingRightPanel";
import ClientInfo from "../ClientInfo/ClientInfo";
import HoldExpiredModal from "../HoldExpiredModal/HoldExpiredModal";
import HoldTokenTimer from "../HoldTokenTimer/HoldTokenTimer";
import SeatFilters from "../SeatFilters/SeatFilters";

import { BookingSeasonClientProps } from "./BookingSeasonClient.type";

//----------- CONSTANTS -------------
const FALLBACK_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE ?? "";

export default function BookingSeasonClient({ id, isRenovation }: BookingSeasonClientProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const mapRef = useRef<BookingRightPanelHandle>(null);

    const accountInfo = useAppSelector(store => store.auth.user);
    const generalMessage = useAppSelector(state => state.ui.generalMessage);
    const bookingState = useAppSelector(state => state.booking.status);
    const selectedSeats = useAppSelector(store => store.bookingFlow.selectedSeats);
    const renovationType = useAppSelector(store => store.bookingFlow.renovationType);
    const clientContactObj = useAppSelector(store => store.bookingFlow.clientContact);
    const holdTokenState = useAppSelector(store => store.bookingFlow.holdTokenObj);

    const [season, setSeason] = useState<SeasonItemDTO | null>(null);
    const [bookingStep, setBookingStep] = useState<BookingStep>("selection");
    const [selectedZone, setSelectedZone] = useState<string | undefined>();
    const [mapKey, setMapKey] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
    const [zonesPrices, setZonesPrices] = useState<Pricing>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [seatsDto, setSeatsDto] = useState<MyEventSeatDTO[] | undefined>();

    useEffect(() => {
        let isMounted = true;

        async function loadAll() {
            try {
                setIsLoading(true);

                let mapKeyLocal = "";

                if (!isRenovation) {
                    await dispatch(setSeats([]));
                }

                dispatch(clearHoldToken());

                try {
                    const seasonResponse = await getSeasonById(Number.parseInt(id));

                    if (!seasonResponse.externalSeasonKey) return;

                    mapKeyLocal = seasonResponse.externalSeasonKey;

                    if (!isMounted) return;

                    setSeason(seasonResponse);

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

                if (!isMounted) return;

                if (isRenovation && renovationType === "changeSeats") {
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
            dispatch(setSeats([]));
        };
    }, []);

    useEffect(() => {
        if (
            holdTokenState?.status === "expired"
            && bookingStep === "payment"
        ) {
            setBookingStep("selection");
        }
    }, [holdTokenState?.status, bookingStep]);

    const handleContinue = async () => {
        switch (bookingStep) {
            case "selection":
                setIsLoading(true);

                let seats: [string, number][] | undefined;

                if (isRenovation) {
                    seats = mapRef.current?.getSelectedSeats();
                }
                else {
                    seats = selectedSeats;
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
                    setSeatsDto(seatsDto);
                }

                if (!season?.isRenewal) {
                    const tokenCreated = await getHoldToken();

                    if (!tokenCreated) {
                        return;
                    }
                }

                setBookingStep("payment");
                setIsLoading(false);
                break;
            case "payment":
                setIsLoading(true);

                if (
                    !accountInfo &&
                    (!clientContactObj?.firstName
                        || !clientContactObj?.lastName
                        || !clientContactObj?.email
                        || !clientContactObj?.phoneNumber)
                ) {
                    setIsLoading(false);
                    setSnackbarSeverity("warning");
                    setSnackbarMessage("Es necesario capturar la información del cliente");
                    setOpenSnackbar(true);
                    return;
                }

                if (!isRenovation) {
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
                else {
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

                setIsLoading(false);
                break;
        }

    };

    const handleBack = async () => {
        try {
            if (holdTokenState && holdTokenState.token) {
                await dispatch(expireHoldToken({ type: "manual" })).unwrap();
            }

            if (isRenovation) {
                await dispatch(setRenovationType("sameSeats"));
            }

            setBookingStep("selection");
        }
        catch (error) {
            console.error(error);

            setSnackbarSeverity("error");
            setSnackbarMessage("An error occurred while trying to release the seats");
            setOpenSnackbar(true);
        }
    };

    const getHoldToken = async () => {
        const selectedSeats = mapRef.current?.getSelectedSeats();

        if (!selectedSeats) {
            return false; // TODO: Add handler
        }

        const selectedLabels = selectedSeats.map(s => s[0]);

        const holdRequest: HoldSeatsActionRequest = {
            eventKey: mapKey,
            seats: selectedLabels
        };

        const holdTokenResponse = await holdSeats(holdRequest);

        if (holdTokenResponse) {
            dispatch(setBookHoldToken(holdTokenResponse));
        }

        return true;
    };

    return (
        <Grid container columns={12} mt={20} spacing={4} pb={8} sx={{ minHeight: "100vh", alignContent: "start" }}>
            {holdTokenState?.token &&
                <Grid size={12}>
                    <HoldTokenTimer />
                </Grid>
            }
            <Grid size={{ xs: 12, lg: 6 }}>
                {season &&
                    <Grid container columns={12} mb={{ xs: 0, md: 4 }}>
                        <Grid size={{ xs: 12, sm: 5, md: 4, lg: 5 }}>
                            <Box mb={2} sx={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                aspectRatio: "16 / 9",
                                overflow: "hidden"
                            }}>
                                <Image
                                    src={season.bannerImageUrl.trim() || FALLBACK_IMAGE}
                                    alt="Season"
                                    fill
                                    onError={(e) => {
                                        e.currentTarget.src = FALLBACK_IMAGE;
                                    }}
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: "center",
                                        borderRadius: 10
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                }
                {bookingStep === "selection" &&
                    <Box display={{ xs: "none", lg: "block" }}>
                        <SeatFilters
                            seasonId={Number(id)}
                            onZoneSelected={(zoneLabel) => { setSelectedZone(zoneLabel) }}
                            onZoneChange={setZonesPrices}
                            buttonText="Ver tickets"
                        />
                    </Box>
                }
                {(bookingStep === "payment" && accountInfo == null) &&
                    <Box mt={4}>
                        <Box>
                            <TicketSeats
                                eventKey={mapKey}
                                seats={seatsDto ?? []}
                                selectedSeats={selectedSeats}
                            />
                        </Box>
                        <Box mt={4}>
                            <ClientInfo />
                        </Box>
                    </Box>
                }
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={3} className="paperCard" sx={{ backgroundColor: "white" }}>
                    <BookingRightPanel
                        ref={mapRef}
                        mapKey={mapKey}
                        bookingMode={isRenovation ? "renovateSeason" : "season"}
                        bookingStep={bookingStep}
                        selectedZone={selectedZone}
                        zonesPrices={zonesPrices}
                        isRenewalWindow={season?.isRenewal}
                        onPay={handleContinue}
                    />
                </Paper>

                <Box mt={4} textAlign="end">
                    {bookingStep !== "selection" &&
                        <Button variant="outlined" color="secondary"
                            onClick={handleBack} sx={{ mr: 2 }}>
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

                {bookingStep === "selection" &&
                    <Box display={{ xs: "block", lg: "none" }} mt={5}>
                        <SeatFilters
                            seasonId={Number(id)}
                            onZoneSelected={(zoneLabel) => { setSelectedZone(zoneLabel) }}
                            onZoneChange={setZonesPrices}
                            buttonText="Ver tickets"
                        />
                    </Box>
                }
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