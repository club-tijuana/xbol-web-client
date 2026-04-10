import { Box, Grid, Typography } from "@mui/material";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";

import SuccessClient from "./components/SuccessClient/SuccessClient";

interface SuccessPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function SuccessPage(props: SuccessPageProps) {
    const { orderId } = await props.params;
    const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
    const trendingEventsVM = trendingEvents.items.map(mapEventToCardVM);

    return (
        <Box>
            <SuccessClient orderId={orderId} />

            <FAQ />

            <Grid container columns={2} spacing={2} my={3}>
                <Grid size={1}>
                    <Advertisement image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/advertisement/advertisement.png`} />
                </Grid>
                <Grid size={1}>
                    <Typography variant="h2" fontWeight={400} color="primary">
                        Otros eventos
                    </Typography>
                    <EventCardGrid
                        eventCards={trendingEventsVM}
                        sizeVariant="xs"
                        styleVariant="default"
                        showCardActions={false}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export const dynamic = 'force-dynamic';