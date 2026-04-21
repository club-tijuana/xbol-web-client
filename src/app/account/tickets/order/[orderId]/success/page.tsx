import { Box, Grid, Typography } from "@mui/material";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";

import SuccessClient from "./components/SuccessClient/SuccessClient";

interface SuccessPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function SuccessPage(props: SuccessPageProps) {
    const { orderId } = await props.params;
    const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
    const trendingEventsVM = trendingEvents.items.map(e =>
        mapEventToCardVM(e, "monthYear")
    );

    return (
        <Box>
            <FullWidthSection
                variant="colorFixedHeight"
                backgroundColor={colors.ui.surface}
                bottomRounded={true}
                height={650}
            >
                <SuccessClient orderId={orderId} />
            </FullWidthSection>

            <FullWidthSection
                variant="color"
                backgroundColor={colors.ui.surface}
                topRounded={true}
                bottomRounded={true}
            >
                <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 20 } }} my={5}>
                    <FAQ />
                </Box>
            </FullWidthSection>

            <Grid container columns={2} spacing={2} my={3}>
                <Grid size={{ xs: 2, lg: 1 }}>
                    <Advertisement image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/advertisement/advertisement.png`} />
                </Grid>
                <Grid size={{ xs: 2, lg: 1 }}>
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
        </Box>
    );
}

export const dynamic = 'force-dynamic';