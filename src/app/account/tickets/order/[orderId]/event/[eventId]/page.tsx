import { Box, Grid, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { formatDate } from "@/helpers/formatDateHelper";
import { EventCategory } from "@/models/enums/event-category.enum";
import { getMyEventDetail, getMyEventTickets } from "@/services/accountService";
import { getEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import TicketQRTabs from "./components/TicketQRTabs/TicketQRTabs";
import TicketSeats from "./components/TicketSeats/TicketSeats";

const getMyEventDetailCached = cache(getMyEventDetail);

export async function generateMetadata(
    { params }: { params: Promise<{ orderId: string; eventId: string; }> }
): Promise<Metadata> {
    const { orderId } = (await params);

    if (!orderId) {
        return {
            title: "Detalle de ticket | PWRTicket",
            description: "Consulta los detalles de tu evento y tus boletos.",
            robots: "noindex, follow",
        };
    }

    const detail = await getMyEventDetailCached(Number.parseInt(orderId));

    const description = detail
        ? `Tus tickets para "${detail.name}" el ${detail.date ? new Date(detail.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} en ${detail.location}. Consulta tus asientos, folio y más detalles del evento.`
        : "Detalles de tus tickets de evento.";

    return buildSeoMetadata({
        title: `${detail?.name || 'Evento'} | Mis Tickets`,
        description,
        url: `https://dev.com/mis-tickets/${orderId}`,
        image: detail?.eventImage ?? "/og-default.jpg",
        type: "article",
    });
}

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

interface TicketPageProps {
    params: Promise<{
        orderId: string;
        eventId: string;
    }>;
}

export default async function TicketPage(props: TicketPageProps) {
    const { orderId, eventId } = await props.params;

    const detail = await getMyEventDetailCached(Number.parseInt(orderId));
    const tickets = await getMyEventTickets({ page: 1, pageSize: 10, orderId: Number.parseInt(orderId), eventId: Number.parseInt(eventId) });
    const otherEvents = await getEvents({ page: 1, eventCategory: EventCategory.Concert, pageSize: 4 });

    const getDateFormat = (): string => {
        if (detail?.date) {
            return formatDate(detail.date, "monthYear");
        }
        else {
            return "";
        }
    }

    return (
        <Box>
            <FullWidthSection
                variant="colorFixedHeight"
                backgroundColor={colors.brand.background}
                height={670}
            >
                <Box mt={15}>
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
                                    selectedSeats={detail?.selectedSeats}
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
                                <Advertisement image="/assets/images/advertisement/advertisement.png" />
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
                        eventCards={otherEvents.items}
                        sizeVariant="xs"
                        styleVariant="default"
                        showCardActions={false}
                    />
                </Grid>
            </Grid>
        </Box >
    );
}