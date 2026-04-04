"use client";

import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import Loader from "@/components/Loader/Loader";
import { formatDate } from "@/helpers/formatDateHelper";
import { MyEventDetailDTO } from "@/models/my-event-detail.dto";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { getMyEventDetail, getMyEventTickets } from "@/services/accountService";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetStatus } from "@/store/slices/shareTicketSlice";
import { colors } from "@/theme/colors";

import TicketQRTabs from "../TicketQRTabs/TicketQRTabs";
import TicketSeats from "../TicketSeats/TicketSeats";

import { TicketPageClientProps } from "./TicketPageClient.type";

interface EventSectionProps {
    eventImage?: string;
}
const EventSection = ({ eventImage }: EventSectionProps) => (
    <Box sx={{
        position: "relative",
        height: 539
    }}
        mb={2.5}
    >
        {eventImage &&
            <Image
                src={eventImage}
                alt="Evento"
                fill
                style={{ objectFit: 'cover', borderRadius: 10 }}
            />
        }
    </Box>
);

export default function TicketPageClient({ orderId, eventId, trendingEvents }: TicketPageClientProps) {
    const router = useRouter();
    const state = store.getState();
    const [detail, setDetail] = useState<MyEventDetailDTO | null>(null);
    const [tickets, setTickets] = useState<PagedResponse<MyTicketDto> | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const status = useAppSelector(store => store.shareTicket.status);
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function load() {
            try {
                const detailResponse = await getMyEventDetail(eventId, orderId);
                const ticketsResponse = await getMyEventTickets({
                    page: 1,
                    pageSize: 10,
                    orderId: orderId,
                    eventId: eventId,
                }); // TODO: Add get next page handler

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
            catch {
                router.push(`/account/tickets`);
            }
        }

        if (status === "idle") {
            load();
        }

        if (status === "success") {
            dispatch(resetStatus());
            load();
        }
    }, [orderId, eventId, status, dispatch, router]);

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

    return (
        <Box>
            {(detail && tickets) &&
                <FullWidthSection
                    variant="colorFixedHeight"
                    backgroundColor={colors.brand.background}
                    height={670}
                >
                    <Box mt={5}>
                        <Typography variant="h6" fontWeight={400} color="primary" mb={1} textAlign='right'>
                            {`Folio ${detail?.folio}`}
                        </Typography>
                        <Grid container columns={12} spacing={6}>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5, xl: 5 }}>
                                <Typography variant="hero" color="primary" mb={4}>
                                    {`Detalles > ${detail?.name}`}
                                </Typography>
                                <Box mb={3}>
                                    <Typography variant="h2" fontWeight={600} color="primary" mb={1}>
                                        {detail?.name}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} color="muted">
                                        {getDateFormat()}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={400}>
                                        {detail?.location}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: { xs: "block", sm: "block", md: "block", lg: "none" } }} mb={5}>
                                    <EventSection eventImage={detail?.eventImage} />
                                </Box>

                                {detail &&
                                    <TicketSeats
                                        seats={detail?.seats}
                                        subTotal={detail?.subTotal}
                                        totalFees={detail?.totalFees}
                                        totalTaxes={detail?.totalTaxes}
                                        total={detail?.total}
                                        selectedSeats={detail ? detail.selectedSeats.map(s => [s, 0]) : []}
                                        eventKey={detail?.eventKey}
                                        currency={detail.currency}
                                    />
                                }

                                <Box sx={{ display: { xs: "block", sm: "block", md: "block", lg: "none" } }} mt={5}>
                                    <Grid container columns={{ xs: 4, sm: 5, md: 5 }} justifyContent="center">
                                        <Grid size={"grow"} justifyContent="center">
                                            {tickets && <TicketQRTabs tickets={tickets.items} />}
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box my={6}>
                                    <Typography variant="h3" color="primary">
                                        ¡Haz feliz a otro fan!
                                    </Typography>
                                    <Typography variant="h6" fontWeight={400} color="text" mt={2.5}>
                                        ¿Un amigo no puede acompañarte? ¿Hubo cambio de planes? ¡Conoce nuestro mercado secundario para esos tickets que no podrán ser usados!
                                    </Typography>
                                    <Advertisement image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/advertisement/advertisement.png`} />
                                </Box>
                            </Grid>
                            <Grid size={{ lg: 7, xl: 7 }} sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }} mb={3}>
                                <EventSection eventImage={detail?.eventImage} />
                                <Grid container columns={5} justifyContent="center">
                                    <Grid size={5}>
                                        {tickets && <TicketQRTabs tickets={tickets.items} />}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </FullWidthSection>
            }

            <FullWidthSection variant="color" backgroundColor={colors.brand.background}>
                <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 39 } }} my={5}>
                    <FAQ />
                </Box>
            </FullWidthSection>

            <Grid container columns={12} mt={6}>
                <Grid size={{ xs: 12, sm: 12, md: 8, lg: 9, xl: 9 }} offset={{ xs: 0, sm: 0, md: 2, lg: 2, xl: 2 }}>
                    <Typography variant="h2" fontWeight={600} color="primary" align="center">
                        Eventos destacados
                    </Typography>
                    <EventCardGrid
                        eventCards={trendingEvents}
                        sizeVariant="xs"
                        styleVariant="default"
                        showCardActions={false}
                    />
                </Grid>
            </Grid>

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

            <Loader isLoading={status === "loading"} />
        </Box >
    );
}