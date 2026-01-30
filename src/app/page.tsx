import { Box, Grid } from "@mui/material";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCrousel from "@/components/EventCarousel/EventCarousel";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { getEventsByCategory, getOutstandingEvents } from "@/services/eventService";

export default async function Home() {
  const outstandingEvents = await getOutstandingEvents();
  const futbolEvents = await getEventsByCategory(2, 4);
  const musicEvents = await getEventsByCategory(1, 3);
  const theaterEvents = await getEventsByCategory(3, 2);

  return (
    <div>
      <main>
        <FullWidthSection>
          <EventCrousel />
        </FullWidthSection>

        <Grid container columns={12} mt={6}>
          <Grid size={9} offset={2}>
            <EventCardGrid
              title="Eventos destacados"
              titleAlign="center"
              eventCards={outstandingEvents}
              columns={6}
              itemSize={1}
              spacing={4}
              size="sm"
              cardTitleClass="textSecondary"
            />
          </Grid>
        </Grid>

        <FullWidthSection backgroundImage="/assets/images/separators/soccer-separator.png" ignoreParentPadding={false}>
          <Box sx={{ paddingBottom: 5, paddingTop: 5 }}>
            <EventCardGrid
              title="Fútbol"
              eventCards={futbolEvents}
              columns={4}
              itemSize={1}
              spacing={4}
              cardTitleClass="textPrimary"
              cardDescriptionClass="textWhite"
              cardDescriptionAlign="left"
              cardTitleAlign="left"
            />
          </Box>
        </FullWidthSection>

        <Box mt={8}>
          <EventCardGrid
            title="Música"
            eventCards={musicEvents}
            columns={4}
            itemSize={1}
            spacing={4}
            cardDescriptionClass="textMuted"
            cardDescriptionAlign="left"
            cardTitleAlign="left"
          />
        </Box>

        <Grid container columns={2} mt={6} mb={8} spacing={10}>
          <Grid size={1}>
            <EventCardGrid
              title="Teatro"
              eventCards={theaterEvents}
              columns={4}
              itemSize={2}
              spacing={4}
              cardDescriptionClass="textMuted"
              cardDescriptionAlign="left"
              cardTitleAlign="left"
            />
          </Grid>
          <Grid size={1}>
            <Advertisement image="/assets/images/advertisement/advertisement.png" />
          </Grid>
        </Grid>
      </main>
    </div>
  );
}
