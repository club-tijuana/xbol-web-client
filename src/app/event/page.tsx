import { Box } from "@mui/material";

import { getEventCategories } from "@/services/eventService";

import EventsSearch from "./components/EventsSearch/EventsSearch";

export default async function EventPage() {
    const eventCategories = await getEventCategories();

    return (
        <Box sx={{ minHeight: "100vh" }} mt={8}>
            <EventsSearch eventCategories={eventCategories} />
        </Box>
    );
}