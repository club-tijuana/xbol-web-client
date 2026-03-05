import { Box, Grid, Typography } from "@mui/material";
import { Metadata } from "next";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { OrderType } from "@/models/enums/order-type.enum";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getMyEvents } from "@/services/accountService";
import { getEvents } from "@/services/eventService";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import TicketTabs from "./components/TicketTabs/TicketTabs";

export function generateMetadata(): Metadata {
    const title = "Mis tickets";
    const description =
        "Consulta todos los eventos y Season Pass en los que tienes tickets. Accede a tus entradas y mantente al día con tus próximos eventos.";
    const url = "https://dev.com/mis-eventos/";

    return buildSeoMetadata({
        title,
        description,
        url,
        image: "/og-default.jpg",
        type: "website",
    });
}

export default async function TicketsPage() {
    const myTickets = await getMyEvents({ page: 1, pageSize: 10, orderType: OrderType.Ticket, rangeDateFrom: null, rangeDateTo: null });
    const mySeasonTickets = await getMyEvents({ page: 1, pageSize: 10, orderType: OrderType.SeasonPass, rangeDateFrom: null, rangeDateTo: null });

    // TODO: Create service to get other events
    const otherEvents = await getEvents({ page: 1, eventCategoryIds: [2], pageSize: 4, rangeDateFrom: null, rangeDateTo: null });
    const otherEventsVM = otherEvents.items.map(mapEventToCardVM);

    return (
        <Box mt={13}>
            <TicketTabs myEvents={myTickets?.items} mySeasons={mySeasonTickets?.items} />

            <Grid container
                columns={2}
                mb={8}
                spacing={6}
                sx={{
                    mt: { sx: 0, sm: 3, md: 3, lg: 6, xl: 6 }
                }}
            >
                <Grid size={{ xs: 2, sm: 2, md: 2, lg: 1, xl: 1 }}>
                    <Advertisement image="/assets/images/advertisement/advertisement.png" />
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 2, lg: 1, xl: 1 }}>
                    <Typography variant="h2" fontWeight={400} color="primary">
                        Otros eventos
                    </Typography>
                    <EventCardGrid
                        eventCards={otherEventsVM}
                        sizeVariant="xs"
                        styleVariant="default"
                        showCardActions={false}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
