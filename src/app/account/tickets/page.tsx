import { Box, Grid, Typography } from "@mui/material";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { EventCategory } from "@/models/enums/event-category.enum";
import { getMySeasonTickets, getMyTickets } from "@/services/accountService";
import { getEvents } from "@/services/eventService";

import TicketTabs from "./components/TicketTabs/TicketTabs";

export default async function TicketsPage() {
    const myTickets = await getMyTickets();
    const mySeasonTickets = await getMySeasonTickets();
    const otherEvents = await getEvents({ page: 1, eventCategory: EventCategory.Concert, pageSize: 4 });

    return (
        <Box mt={13}>
            <TicketTabs myTickets={myTickets} seasonTickets={mySeasonTickets} />
            <Grid container columns={2} mt={6} mb={8} spacing={6}>
                <Grid size={1}>
                    <Advertisement image="/assets/images/advertisement/advertisement.png" />
                </Grid>
                <Grid size={1}>
                    <Typography variant="h2" fontWeight={400} color="primary">
                        Otros eventos
                    </Typography>
                    <EventCardGrid
                        eventCards={otherEvents.items}
                        columns={4}
                        itemSize={1}
                        spacing={2.5}
                        size="sm"
                        cardTitleColor="text"
                        showCardActions={false}
                        cardImageHeight={148}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
