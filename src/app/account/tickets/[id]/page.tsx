import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { EventCategory } from "@/models/enums/event-category.enum";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { getEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";

import TicketQRGrid from "./components/TicketQRGrid/TicketQRGrid";
import TicketSeats from "./components/TicketSeats/TicketSeats";

export default async function TicketPage() {
    const otherEvents = await getEvents({ page: 1, eventCategory: EventCategory.Concert, pageSize: 4 });

    const tickets: MyTicketDto[] = [
        {
            id: 1,
            dateStr: '28/10/2026',
            image: "",
            location: "Estadio Caliente",
            ticketCode: "",
            title: "Bad Bunny"
        },
        {
            id: 2,
            dateStr: '28/10/2026',
            image: "",
            location: "Estadio Caliente",
            ticketCode: "",
            title: "Bad Bunny"
        }
    ]

    return (
        <Box mt={15}>
            <Typography variant="h6" fontWeight={400} color="primary" mb={1} textAlign='right'>
                Folio 162918-23197
            </Typography>
            <Grid container columns={12} spacing={6}>
                <Grid size={5}>
                    <Typography variant="hero" color="primary" mb={4}>
                        {"Detalles > Bad Bunny"}
                    </Typography>
                    <Box mb={3}>
                        <Typography variant="h2" fontWeight={600} color="primary" mb={1}>
                            Bad Bunny
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="muted">
                            28/10/2026
                        </Typography>
                        <Typography variant="h6" fontWeight={400}>
                            Estadio Caliente
                        </Typography>
                    </Box>

                    <TicketSeats />

                    <Box mt={6}>
                        <Typography variant="h3" color="primary">
                            ¡Haz feliz a otro fan!
                        </Typography>
                        <Typography variant="h6" fontWeight={400} color="text" mt={2.5}>
                            ¿Un amigo no puede acompañarte? ¿Hubo cambio de planes? ¡Conoce nuestro mercado secundario para esos tickets que no podrán ser usados!
                        </Typography>
                        <Advertisement image="/assets/images/advertisement/advertisement.png" />
                    </Box>
                </Grid>
                <Grid size={7}>
                    <Box sx={{
                        position: "relative",
                        height: 539
                    }}
                        mb={2.5}
                    >
                        <Image
                            src="/assets/images/events/bad_bunny_lg.png"
                            alt="Evento"
                            fill
                            style={{ objectFit: 'cover', borderRadius: 10 }}
                        />
                    </Box>

                    <TicketQRGrid
                        columns={{ sx: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
                        spacing={1.5}
                        title="Tus boletos"
                        tickets={tickets}
                    />
                </Grid>
            </Grid>

            <FullWidthSection variant="color" backgroundColor={colors.brand.background}>
                <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 39 } }} my={5}>
                    <FAQ />
                </Box>
            </FullWidthSection>

            <Grid container columns={12} mt={6}>
                <Grid size={9} offset={2}>
                    <Typography variant="h2" fontWeight={600} color="primary" align="center">
                        Eventos destacados
                    </Typography>
                    <EventCardGrid
                        eventCards={otherEvents.items}
                        columns={6}
                        itemSize={1}
                        spacing={2.5}
                        size="sm"
                        cardTitleColor="text"
                        showCardActions={false}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}