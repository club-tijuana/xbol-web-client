import LaunchRoudedIcon from "@mui/icons-material/LaunchRounded";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { getOutstandingEvents } from "@/services/eventService";

export default async function EventPage() {
    const outstandingEvents = await getOutstandingEvents().splice(0, 4);

    return (
        <Box mt={10}>
            <FullWidthSection backgroundImage="/assets/images/separators/soccer-separator.png" ignoreParentPadding={false} backgroundImageFull={false}>
                <Grid container columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 18 }} mt={15} spacing={7}>
                    <Grid size={8}>
                        <Typography variant="h2" className="textPrimary">
                            Bad Bunny
                            <LaunchRoudedIcon className="textWhite" fontSize="large" sx={{ marginLeft: 1 }} />
                        </Typography>
                        <Typography variant="xl2" className="textPrimary">
                            Información
                        </Typography>
                        <Typography variant="subtitle1" className="textWhite" mb={4}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis consectetur malesuada. Phasellus luctus augue eu tellus varius porttitor. Nam imperdiet at odio posuere ullamcorper. Morbi sem nisi, gravida in maximus et, molestie sed nisi. Morbi gravida semper ante in placerat.
                        </Typography>

                        <Paper elevation={3} className="paperCard">
                            <Typography variant="xl2" className="textPrimary">
                                Boletos
                            </Typography>
                            <Divider sx={{ mt: 2, borderWidth: 1, borderColor: 'var(--color-bg-muted)' }} />
                            <Grid container columns={6} mt={1}>
                                <Grid size={2}>
                                    <Typography variant="subtitle1" className="textPrimary textBold">
                                        Fecha
                                    </Typography>
                                    <Typography variant="subtitle1" className="textPrimary textBold">
                                        DD/MM/AA
                                    </Typography>
                                </Grid>
                                <Grid size={2} alignContent='center'>
                                    <Typography variant="subtitle1" className="textSecondary">
                                        Ubicación
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
                        </Paper>
                    </Grid>
                    <Grid size={10} mb={4}>
                        <Box sx={{
                            position: "relative",
                            height: 539
                        }}
                            mb={3}
                        >
                            <Image
                                src="/assets/images/events/bad_bunny_lg.png"
                                alt="Evento"
                                fill
                            />
                        </Box>
                        <Typography variant="xl2" className="textPrimary">
                            Galería
                        </Typography>
                        <Grid container columns={2} spacing={2}>
                            <Grid size={1}>
                                <Box sx={{
                                    position: "relative",
                                    height: 184
                                }}
                                    mb={3}
                                >
                                    <Image
                                        src="/assets/images/events/bad_bunny_lg.png"
                                        alt="Evento"
                                        fill
                                    />
                                </Box>
                            </Grid>
                            <Grid size={1}>
                                <Box sx={{
                                    position: "relative",
                                    height: 184
                                }}
                                    mb={3}
                                >
                                    <Image
                                        src="/assets/images/events/bad_bunny_lg.png"
                                        alt="Evento"
                                        fill
                                    />
                                </Box>
                            </Grid>
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
                        eventCards={outstandingEvents}
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