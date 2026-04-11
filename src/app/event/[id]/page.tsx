import {
  Box,
  Grid,
  Typography,
} from "@mui/material";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";

import VisitorRegister from "../components/VisitorRegister/VisitorRegister";

import EventClientWrapper from "./components/EventClientWrapper/EventClientWrapper";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;

  const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
  const trendingEventsVM = trendingEvents.items.map(mapEventToCardVM);

  return (
    <Box>
      <VisitorRegister eventId={Number(id)} />
      <EventClientWrapper eventId={Number(id)} />
      <FullWidthSection
        variant="color"
        backgroundColor={colors.brand.background}
      >
        <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 20 } }} my={5}>
          <FAQ />
        </Box>
      </FullWidthSection>
      <Grid
        container
        columns={{ xs: 1, sm: 1, md: 2 }}
        spacing={5}
        mt={5}
        mb={4}
      >
        <Grid size={1}>
          <Advertisement image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/advertisement/advertisement.png`} />
        </Grid>
        <Grid size={1}>
          <Typography variant="h2" fontWeight={400} color="primary">
            Otros eventos
          </Typography>
          <EventCardGrid
            eventCards={trendingEventsVM}
            showCardActions={false}
            sizeVariant="xs"
            styleVariant="default"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
