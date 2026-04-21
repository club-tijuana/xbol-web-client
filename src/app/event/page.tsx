import { Box } from "@mui/material";

import EventsSearch from "./components/EventsSearch/EventsSearch";

export default async function EventPage() {

    return (
        <Box sx={{ minHeight: "100vh" }} mt={20}>
            <EventsSearch />
        </Box>
    );
}