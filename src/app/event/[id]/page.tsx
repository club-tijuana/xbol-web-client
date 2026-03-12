import { ArrowDownwardOutlined, StarBorder } from "@mui/icons-material";
import LaunchRoudedIcon from "@mui/icons-material/LaunchRounded";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { formatDate } from "@/helpers/formatDateHelper";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getEventDetail, getTrendingEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import VisitorRegister from "../components/VisitorRegister/VisitorRegister";


const getEventCached = cache(getEventDetail);

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {

    const { id } = await params;

    if (!id) {
        return {
            title: "Evento | PWRTicket",
            description: "Consulta los detalles de este evento.",
            robots: "noindex, follow",
        };
    }

    const event = await getEventCached(Number(id));

    return buildSeoMetadata({
        title: `${event.name} | Boletos y fechas`,
        description: event.longDescription?.slice(0, 155) ?? "Detalles del evento",
        url: `https://dev.com/eventos/${event.id}`,
        image: event.gallery?.[0] ?? "/og-default.jpg",
        type: "article",
    });
}


interface EventPageProps {
    params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
    const { id } = await params;

    const event = await getEventCached(Number.parseInt(id));

    // TODO: Create service to get other events
    const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
    const trendingEventsVM = trendingEvents.items.map(mapEventToCardVM);

    const Gallery =
        <>
            <Box sx={{ position: "relative", height: { xs: 300, sm: 400, md: 439, lg: 539 } }} mb={3}>
                <Chip
                    label={event.categories[0].displayName}
                    color={"secondary"}
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        maxWidth: "100%",
                        fontWeight: 400,
                        fontSize: 22,
                        color: 'white',
                        borderRadius: 1,
                        height: 45,
                        paddingLeft: 4,
                        paddingRight: 4,
                        zIndex: 1,
                        "& .MuiChip-label": {
                            fontSize: 20,
                            fontWeight: 400,
                            color: colors.light.primary,
                        },
                    }}
                />
                <Image
                    src={event.gallery[0]}
                    alt="Evento"
                    fill
                    style={{ objectFit: 'cover', borderRadius: 10 }}
                />
            </Box>
            <Typography variant="h3" fontWeight={600} color="primary">
                Galería
            </Typography>
            <Grid container columns={2} spacing={2} mt={1.2}>
                {
                    event.gallery.map((image, index) => (
                        <Grid size={1} key={index}>
                            <Box sx={{ position: "relative", height: 184 }}
                                mb={3}
                            >
                                <Image src={image} alt="Evento" fill style={{ objectFit: 'cover', borderRadius: 10 }} />
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
        </>;

    return (
        <Box>
            <VisitorRegister eventId={Number(id)} />
            <FullWidthSection
                variant="imageFixedHeight"
                image="/assets/images/separators/soccer-separator.png"
                height={630}>
                <Grid container columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 18 }} mt={15} spacing={{ xs: 0, sm: 0, md: 3, lg: 7 }}>
                    <Grid size={{ xs: 10, sm: 10, md: 6, lg: 5, xl: 8 }} offset={{ xs: 1, sm: 1, md: 0 }}>
                        <Typography variant="hero" color='primary'>
                            {event.name}
                            <LaunchRoudedIcon color='neutral' fontSize="large" sx={{ marginLeft: 1, marginRight: 1 }} />
                            <StarBorder color='neutral' fontSize="large" />
                        </Typography>
                        <Typography variant="h3" fontWeight={400} mb={1} mt={3} color='primary'>
                            Información
                        </Typography>
                        <Typography variant="bodyLg" mb={4} color="neutral">
                            {event.longDescription}
                        </Typography>
                        <Typography variant="h3" fontWeight={400} mb={1} mt={3} color='primary'>
                            Dirección del recinto
                        </Typography>
                        <Typography variant="bodyLg" mb={4} color="neutral">
                            {event.fullAddress}
                        </Typography>

                        <Box sx={{ display: { sm: 'block', md: 'none' } }} mt={4}>
                            {Gallery}
                        </Box>

                        <Paper elevation={3} className="paperCard" sx={{ mt: { xs: 0, sm: 0, md: 6 }, mb: 8 }}>
                            <Typography variant="h3" color="primary">
                                Boletos
                            </Typography>
                            <Divider sx={{ mt: 2, borderWidth: 1, borderColor: 'var(--color-bg-muted)' }} />
                            {
                                event.schedules.map(s => (
                                    <Accordion key={s.id} elevation={0}>
                                        <AccordionSummary
                                            expandIcon={
                                                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                                    <Button variant="outlined" href={`/booking/${s.id}`}>
                                                        <Typography variant="body2" py={0.3}>
                                                            Ver tickets
                                                        </Typography>
                                                    </Button>
                                                    <Box display="flex" flexDirection="row" mt={1}>
                                                        <ArrowDownwardOutlined className="arrowIcon" fontSize="small" />
                                                        <Typography variant="body2" color="text">
                                                            Secciones
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                            sx={{
                                                "& .MuiAccordionSummary-expandIconWrapper": {
                                                    transform: "none",
                                                },
                                                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                                                    transform: "none",
                                                },

                                                "& .MuiAccordionSummary-expandIconWrapper .arrowIcon": {
                                                    transition: "transform 0.3s ease",
                                                },
                                                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded .arrowIcon": {
                                                    transform: "rotate(180deg)",
                                                },
                                            }}
                                        >
                                            <Grid container columns={6} my={2} sx={{ width: "100%" }} spacing={{ xs: 0, lg: 1 }}>
                                                <Grid size={{ xs: 6, sm: 3, md: 3, lg: 2 }}>
                                                    <Typography variant="subtitle1" color="primary">
                                                        Fecha
                                                    </Typography>
                                                    <Typography variant="subtitle2" fontWeight={400}>
                                                        {
                                                            formatDate(s.date, "date")
                                                        }
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 3, md: 3, lg: 2 }} alignContent='start' my={{ xs: 1, sm: 0 }}>
                                                    <Typography variant="subtitle1" color="primary">
                                                        Hora
                                                    </Typography>
                                                    <Typography variant="subtitle2" fontWeight={400}>
                                                        {
                                                            formatDate(s.date, "time")
                                                        }
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6, sm: 2, md: 2 }} alignContent='start' mt={{ xs: 0, sm: 1 }}>
                                                    <Typography variant="subtitle1" color="primary">
                                                        Estadio
                                                    </Typography>
                                                    <Typography variant="subtitle2" fontWeight={400}>
                                                        {s.location}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Divider sx={{ mb: 2, borderWidth: 1 }} />
                                            <Grid container columns={2} px={8}>
                                                <Grid size={1}>
                                                    <Typography variant="subtitle1" color="primary">Sección</Typography>
                                                </Grid>
                                                <Grid size={1}>
                                                    <Typography variant="subtitle1" color="primary" textAlign="right">Precio</Typography>
                                                </Grid>
                                            </Grid>
                                            {(s.sectionPrices && s.sectionPrices.length > 0) && s.sectionPrices.map((section, index) => (
                                                <Box key={index}>
                                                    <Grid container columns={2} px={8}>
                                                        <Grid size={1}>
                                                            <Typography variant="subtitle2" color="text">{section.objects.join(", ")}</Typography>
                                                        </Grid>
                                                        <Grid size={1}>
                                                            <Typography variant="subtitle2" color="text" textAlign="right">
                                                                {formatCurrency(section.price ?? 0, section.currency)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    {(index < s.sectionPrices.length - 1) && <Divider sx={{ my: 1, borderWidth: 1 }} />}
                                                </Box>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            }
                        </Paper>
                    </Grid>
                    <Grid size={{ md: 6, lg: 7, xl: 10 }} mb={4} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                        {Gallery}
                    </Grid>
                </Grid>
            </FullWidthSection>
            <FullWidthSection variant="color" backgroundColor={colors.brand.background}>
                <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 20 } }} my={5}>
                    <FAQ />
                </Box>
            </FullWidthSection>
            <Grid container columns={{ xs: 1, sm: 1, md: 2 }} spacing={5} mt={5} mb={4}>
                <Grid size={1}>
                    <Advertisement image="/assets/images/advertisement/advertisement.png" />
                </Grid>
                <Grid size={1}>
                    <Typography variant="h2" fontWeight={400} color="primary">
                        Otros eventos
                    </Typography>
                    <EventCardGrid
                        eventCards={trendingEventsVM}
                        showCardActions={false}
                        sizeVariant="xs"
                        styleVariant="default"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}