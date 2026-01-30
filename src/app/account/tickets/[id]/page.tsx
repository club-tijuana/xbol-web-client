import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { getOutstandingEvents } from "@/services/eventService";

import TicketQRGrid from "./components/TicketQRGrid/TicketQRGrid";
import TicketSeats from "./components/TicketSeats/TicketSeats";

export default async function TicketPage() {
    const outstandingEvents = await getOutstandingEvents();

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
            <Typography variant="subtitle1" className="textPrimary" mb={1} textAlign='right'>
                Folio 162918-23197
            </Typography>
            <Grid container columns={12} spacing={6}>
                <Grid size={5}>
                    <Typography variant="h2" className="textPrimary" mb={4}>
                        {"Detalles > Bad Bunny"}
                    </Typography>
                    <Box mb={3}>
                        <Typography variant="h4" className="textPrimary" mb={1}>
                            Bad Bunny
                        </Typography>
                        <Typography variant="subtitle1" className="textSecondary textBold">
                            28/10/2026
                        </Typography>
                        <Typography variant="subtitle1">
                            Estadio Caliente
                        </Typography>
                    </Box>

                    <TicketSeats />

                    <Box mt={6}>
                        <Typography variant="xl2" className="textPrimary">
                            ¡Haz feliz a otro fan!
                        </Typography>
                        <Typography variant="subtitle1">
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
                        mb={3}
                    >
                        <Image
                            src="/assets/images/events/bad_bunny_lg.png"
                            alt="Evento"
                            fill
                        />
                    </Box>

                    <TicketQRGrid
                        columnsXs={1}
                        columnsSm={2}
                        columnsMd={3}
                        columnsLg={4}
                        columnsXl={4}
                        spacing={2}
                        title="Tus boletos"
                        tickets={tickets}
                    />
                </Grid>
            </Grid>

            <FullWidthSection backgroundColor="#EDEDED">
                <Box sx={{ px: { xs: 0, sm: 0, md: 10, lg: 20, xl: 77 } }} my={5}>
                    <FAQ />
                </Box>
            </FullWidthSection>

            <Grid container columns={12} mt={6}>
                <Grid size={9} offset={2}>
                    <EventCardGrid
                        title="Eventos destacados"
                        titleAlign="center"
                        eventCards={outstandingEvents}
                        columns={6}
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