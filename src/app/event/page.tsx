import { Box } from "@mui/material";

import EventsSearch from "./components/EventsSearch/EventsSearch";

export default function EventPage() {
    return (
        <Box sx={{ minHeight: "100vh" }} mt={8}>
            <EventsSearch />
        </Box>
    );
}