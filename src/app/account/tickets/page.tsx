import { Box, Grid, Typography } from "@mui/material";
import { Metadata } from "next";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import TicketsClientWrapper from "./components/TicketsClientWrapper/TicketsClientWrapper";

export const dynamic = 'force-dynamic';

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
    const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
    const trendingEventsVM = trendingEvents.items.map(e =>
        mapEventToCardVM(e, 'monthYear')
    );

    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            mt: { xs: 3, sm: 4, md: 5 }
        }}>
            <TicketsClientWrapper />

            {trendingEventsVM.length > 0 && (
                <Grid container
                    columns={2}
                    mb={8}
                    spacing={6}
                    sx={{
                        mt: { xs: 0, sm: 3, md: 3, lg: 6, xl: 6 }
                    }}
                >
                    <Grid size={{ xs: 2, sm: 2, md: 2, lg: 1, xl: 1 }}>
                        <Advertisement image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/advertisement/advertisement.png`} />
                    </Grid>
                    <Grid size={{ xs: 2, sm: 2, md: 2, lg: 1, xl: 1 }}>
                        <Typography variant="h2" fontWeight={400} color="primary">
                            Otros eventos
                        </Typography>
                        <EventCardGrid
                            eventCards={trendingEventsVM}
                            sizeVariant="xs"
                            styleVariant="default"
                        />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
