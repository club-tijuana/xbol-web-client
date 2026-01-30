import { Box, Grid } from "@mui/material";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { getMySeasonTickets, getMyTickets } from "@/services/accountService";
import { getOutstandingEvents } from "@/services/eventService";

import TicketList from "./components/TicketList/TicketList";

export default async function TicketsPage() {
    const myTickets = await getMyTickets();
    const mySeasonTickets = await getMySeasonTickets();
    const otherEvents = await getOutstandingEvents(4);

    return (
        <Box mt={25}>
            <Box>
                <TicketList
                    title="Tus tickets"
                    tickets={myTickets}
                />
            </Box>
            <Box mt={5}>
                <TicketList
                    title="Xolopass"
                    tickets={mySeasonTickets}
                />
            </Box>
            <Grid container columns={2} mt={6} mb={8} spacing={6}>
                <Grid size={1}>
                    <Advertisement image="/assets/images/advertisement/advertisement.png" />
                </Grid>
                <Grid size={1}>
                    <EventCardGrid
                        columns={4}
                        itemSize={1}
                        spacing={5}
                        title="Otros eventos"
                        size="sm"
                        eventCards={otherEvents}
                        cardTitleClass="textSecondary"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
