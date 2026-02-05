import LaunchRoudedIcon from "@mui/icons-material/LaunchRounded";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { EventCategory } from "@/models/enums/event-category.enum";
import { getEvents, getEventDetail } from "@/services/eventService";

interface EventPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EventPage(props: EventPageProps) {
    const { id } = await props.params;

    const event = await getEventDetail(Number.parseInt(id));
    const outstandingEvents = await getEvents({ page: 1, eventCategory: EventCategory.Sports, pageSize: 4 });

    return (
        <Box mt={10}>
            <FullWidthSection backgroundImage="/assets/images/separators/soccer-separator.png" ignoreParentPadding={false} backgroundImageFull={false}>
                <Grid container columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 18 }} mt={15} spacing={7}>
                    <Grid size={8}>
                        <Typography variant="h2" className="textPrimary">
                            {event.name}
                            <LaunchRoudedIcon className="textWhite" fontSize="large" sx={{ marginLeft: 1 }} />
                        </Typography>
                        <Typography variant="xl2" className="textPrimary">
                            Información
                        </Typography>
                        <Typography variant="subtitle1" className="textWhite" mb={4}>
                            {event.longDescription}
                        </Typography>

                        <Paper elevation={3} className="paperCard">
                            <Typography variant="xl2" className="textPrimary">
                                Boletos
                            </Typography>
                            <Divider sx={{ mt: 2, borderWidth: 1, borderColor: 'var(--color-bg-muted)' }} />
                            {
                                event.schedules.map(s => (
                                    <Grid container columns={6} mt={1} key={s.id}>
                                        <Grid size={2}>
                                            <Typography variant="subtitle1" className="textPrimary textBold">
                                                Fecha
                                            </Typography>
                                            <Typography variant="subtitle1" className="textPrimary textBold">
                                                {
                                                    new Date(s.date).toLocaleDateString("ex-MX", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric"
                                                    })
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid size={2} alignContent='center'>
                                            <Typography variant="subtitle1" className="textSecondary">
                                                {s.location}
                                            </Typography>
                                        </Grid>
                                        <Grid size={2} textAlign={'right'} alignContent={'center'}>
                                            <Button className="btn btnPrimaryDark">
                                                <Typography variant="subtitle1" className="textWhite" px={3}>
                                                    Tickets
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Paper>
                    </Grid>
                    <Grid size={10} mb={4}>
                        <Box sx={{ position: "relative", height: 539 }} mb={3}>
                            <Image src={event.gallery[0]} alt="Evento" fill />
                        </Box>
                        <Typography variant="xl2" className="textPrimary">
                            Galería
                        </Typography>
                        <Grid container columns={2} spacing={2}>
                            {
                                event.gallery.map((image, index) => (
                                    <Grid size={1} key={index}>
                                        <Box sx={{ position: "relative", height: 184 }}
                                            mb={3}
                                        >
                                            <Image src={image} alt="Evento" fill />
                                        </Box>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </FullWidthSection>
            <FullWidthSection backgroundColor="#EDEDED" ignoreParentPadding={false}>
                <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 39 } }} my={5}>
                    <FAQ />
                </Box>
            </FullWidthSection>
            <Grid container columns={{ sm: 1, md: 2 }} spacing={5} mt={5} mb={4}>
                <Grid size={1}>
                    <Advertisement image="/assets/images/advertisement/advertisement.png" />
                </Grid>
                <Grid size={1}>
                    <EventCardGrid
                        title="Otros eventos"
                        titleAlign="left"
                        eventCards={outstandingEvents.items}
                        columns={4}
                        itemSize={1}
                        spacing={4}
                        size="sm"
                        cardTitleClass="textSecondary"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}