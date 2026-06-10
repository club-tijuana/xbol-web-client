"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import Loader from "@/components/Loader/Loader";
import { formatDate } from "@/helpers/formatDateHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { eventImageOrDefault } from "@/models/event-image";
import { MyEventDetailDTO } from "@/models/my-event-detail.dto";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { getMyEventDetail, getMyEventTickets } from "@/services/accountService";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetStatus } from "@/store/slices/shareTicketSlice";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

import TicketQRTabs from "../TicketQRTabs/TicketQRTabs";
import TicketSeats from "../TicketSeats/TicketSeats";

import { TicketPageClientProps } from "./TicketPageClient.type";

//----------- CONSTANTS -------------
const PAGE_SIZE: number = 10;

interface EventSectionProps {
    eventImage?: string;
}
const EventSection = ({ eventImage }: EventSectionProps) => {
    return (
        <Box sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden"
        }}
            mb={2.5}
        >
            <Image
                src={eventImageOrDefault(eventImage)}
                alt="Evento"
                fill
                onError={(e) => {
                    e.currentTarget.src = eventImageOrDefault();
                }}
                style={{
                    objectFit: 'cover',
                    objectPosition: "center",
                    borderRadius: 10
                }}
            />
        </Box>
    );
};

export default function TicketPageClient({ orderId, eventId, trendingEvents }: TicketPageClientProps) {
    const token = useAppSelector(state => state.auth.user?.token);
    const router = useRouter();
    const state = store.getState();
    const [detail, setDetail] = useState<MyEventDetailDTO | null>(null);
    const [tickets, setTickets] = useState<PagedResponse<MyTicketDto> | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const status = useAppSelector(store => store.shareTicket.status);
    const generalMessage = useAppSelector(state => state.ui.generalMessage);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const dispatch = useAppDispatch();
    const isFetchingRef = useRef(false);

    useEffect(() => {
        async function load() {
            if (!token) {
                return;
            }

            isFetchingRef.current = true;

            try {
                const detailResponse = await getMyEventDetail(eventId, orderId);
                const ticketsResponse = await getMyEventTickets({
                    page: currentPage,
                    pageSize: PAGE_SIZE,
                    orderId: orderId,
                    eventId: eventId,
                });

                if (detailResponse) {
                    setDetail(detailResponse);
                }

                if (ticketsResponse) {
                    setTickets(ticketsResponse);
                }

                if (ticketsResponse !== null && (!ticketsResponse.totalCount || ticketsResponse?.totalCount === 0)) {
                    router.push(`/account/tickets`);
                }
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));

                router.push(`/account/tickets`);
            }
            finally {
                isFetchingRef.current = false;
            }
        }

        if (status === "idle") {
            load();
        }

        if (status === "success") {
            dispatch(resetStatus());
            load();
        }
    }, [orderId, eventId, status, dispatch, router, token]);

    useEffect(() => {
        if (state.shareTicket.error) {
            const timeout = setTimeout(() => {
                setSnackbarMessage(state.shareTicket.error ?? "Ha ocurrido un error desconocido");
                setOpenSnackbar(true);
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [state.shareTicket.error]);

    const getDateFormat = (): string => {
        if (detail && detail?.date) {
            return formatDate(detail.date, "monthYear");
        }
        else {
            return "";
        }
    }

    const loadMoreTickets = async (loadAll: boolean = false) => {
        if (isFetchingRef.current) {
            return;
        }

        isFetchingRef.current = true;

        try {
            const nextPage = loadAll ? 1 : currentPage + 1;

            const ticketsResponse = await getMyEventTickets({
                page: nextPage,
                pageSize: loadAll ? 100 : PAGE_SIZE,
                orderId,
                eventId,
            });

            if (!ticketsResponse || ticketsResponse.items.length === 0) {
                return;
            }

            setCurrentPage(ticketsResponse.page);

            setTickets(prev => {
                if (!prev) {
                    return prev;
                }

                if (loadAll) {
                    return {
                        ...ticketsResponse
                    };
                }

                const existingIds = new Set(prev.items.map(i => i.id));

                const newItems = ticketsResponse.items.filter(
                    i => !existingIds.has(i.id)
                );

                return {
                    ...prev,
                    items: [...prev.items, ...newItems],
                    page: ticketsResponse.page,
                    totalPages: ticketsResponse.totalPages,
                    totalCount: ticketsResponse.totalCount
                };
            });
        }
        catch (error) {
            dispatch(showGeneralMessage({
                message: getErrorMessage(error),
                severity: "error"
            }));
        }
        finally {
            isFetchingRef.current = false;
        }
    };

    return (
        <Box>
            {(detail && tickets) &&
                <FullWidthSection
                    variant="colorFixedHeight"
                    backgroundColor={colors.ui.surface}
                    bottomRounded={true}
                    height={670}
                >
                    <Box mt={20}>
                        <Typography variant="h6" color="primary" mb={1} textAlign='right'>
                            {`Folio ${detail?.folio}`}
                        </Typography>
                        <Grid container columns={12} spacing={6}>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5, xl: 5 }}>
                                <Typography variant="h1" color="primary" mb={4}>
                                    {`Detalles > ${detail?.name}`}
                                </Typography>
                                <Box mb={5}>
                                    <Typography variant="h4" color="primary" mb={3}>
                                        {detail?.name}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                        mb={1}
                                    >
                                        <CalendarTodayOutlined color="primary" />
                                        {getDateFormat()}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                        mb={1}
                                    >
                                        <LocationOnOutlined color="primary" />
                                        {detail?.location}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: { xs: "block", sm: "block", md: "block", lg: "none" } }} mb={5}>
                                    <EventSection eventImage={detail.eventImage} />
                                </Box>

                                {detail &&
                                    <TicketSeats
                                        seats={detail?.seats}
                                        subTotal={detail?.subTotal}
                                        totalFees={detail?.totalFees}
                                        totalTaxes={detail?.totalTaxes}
                                        total={detail?.total}
                                        selectedSeats={detail
                                            ? detail.selectedSeats.map(s => ({
                                                seatKey: s,
                                                seatPrice: 0,
                                                priceListItemId: 0
                                            }))
                                            : []}
                                        eventKey={detail?.eventKey}
                                        currency={detail.currency}
                                    />
                                }

                                <Box sx={{ display: { xs: "block", sm: "block", md: "block", lg: "none" } }} mt={5}>
                                    <Grid container columns={{ xs: 4, sm: 5, md: 5 }} justifyContent="center">
                                        <Grid size={"grow"} justifyContent="center">
                                            {tickets &&
                                                <TicketQRTabs
                                                    tickets={tickets.items}
                                                    canLoadMore={tickets.page < tickets.totalPages}
                                                    onLoadMore={loadMoreTickets}
                                                    onLoadAll={() => loadMoreTickets(true)}
                                                />
                                            }
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box my={6}>
                                    <Typography variant="h4" color="primary">
                                        ¡Haz feliz a otro fan!
                                    </Typography>
                                    <Typography variant="subtitle1" color="secondary" mt={2.5}>
                                        ¿Un amigo no puede acompañarte? ¿Hubo cambio de planes? ¡Conoce nuestro mercado secundario para esos tickets que no podrán ser usados!
                                    </Typography>
                                    <Advertisement image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/advertisement/advertisement.png`} />
                                </Box>
                            </Grid>
                            <Grid size={{ lg: 7, xl: 7 }} sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }} mb={3}>
                                <EventSection eventImage={detail.eventImage} />
                                <Grid container columns={5} justifyContent="center">
                                    <Grid size={5}>
                                        {tickets &&
                                            <TicketQRTabs
                                                tickets={tickets.items}
                                                canLoadMore={tickets.page < tickets.totalPages}
                                                onLoadMore={loadMoreTickets}
                                                onLoadAll={() => loadMoreTickets(true)}
                                            />
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </FullWidthSection>
            }

            <FullWidthSection
                variant="color"
                backgroundColor={colors.ui.background}
            >
                <FullWidthSection
                    variant="color"
                    backgroundColor={colors.ui.surface}
                    topRounded={true}
                    bottomRounded={true}
                >
                    <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 39 } }} my={5}>
                        <FAQ />
                    </Box>
                </FullWidthSection>

                <Grid container columns={12} mt={6}>
                    <Grid size={12}>
                        <Typography variant="h2" fontWeight={600} color="primary" align="center">
                            Eventos destacados
                        </Typography>
                        <EventCardGrid
                            eventCards={trendingEvents}
                            sizeVariant="sm"
                            styleVariant="default"
                            showCardBadge={true}
                        />
                    </Grid>
                </Grid>
            </FullWidthSection>



            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSnackbar}
                autoHideDuration={5000}>
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="error"
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

            <Loader isLoading={(status === "loading" || isFetchingRef.current)} />
        </Box >
    );
}
