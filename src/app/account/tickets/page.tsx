import { Box, Grid, Typography } from "@mui/material";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { EventCategory } from "@/models/enums/event-category.enum";
import { OrderType } from "@/models/enums/order-type.enum";
import { getMyEvents } from "@/services/accountService";
import { getEvents } from "@/services/eventService";

import TicketTabs from "./components/TicketTabs/TicketTabs";

console.log("TicketTabs:", TicketTabs);

export default async function TicketsPage() {
    const myTickets = await getMyEvents({ page: 1, pageSize: 10, orderType: OrderType.Ticket });
    const mySeasonTickets = await getMyEvents({ page: 1, pageSize: 10, orderType: OrderType.SeasonPass });
    const otherEvents = await getEvents({ page: 1, eventCategory: EventCategory.Concert, pageSize: 4 });

    console.log("myTickets", myTickets?.items);
    console.log("mySeasonTickets", mySeasonTickets?.items);
    return (
        <Box mt={13}>
            <TicketTabs myEvents={myTickets?.items} mySeasons={mySeasonTickets?.items} />

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
