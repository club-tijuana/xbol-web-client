import { Box, Grid } from "@mui/material";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCrousel from "@/components/EventCarousel/EventCarousel";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { EventCategory } from "@/models/enums/event-category.enum";
import { getEvents, getMainEvents } from "@/services/eventService";

export default async function Home() {
  const mainEvents = await getMainEvents();
  const futbolEvents = await getEvents({ page: 1, eventCategory: EventCategory.Sports, pageSize: 3 });
  const musicEvents = await getEvents({ page: 1, eventCategory: EventCategory.Concert, pageSize: 3 });
  const theaterEvents = await getEvents({ page: 1, eventCategory: EventCategory.Theater, pageSize: 3 });

  return (
    <div>
      <main>
        <FullWidthSection>
          <EventCrousel />
        </FullWidthSection>

        <Grid container columns={12} mt={6}>
          <Grid size={12}>
            <EventCardGrid
              title="Eventos destacados"
              titleAlign="center"
              eventCards={mainEvents.items}
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
              eventCards={futbolEvents.items}
              columns={3}
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
            eventCards={musicEvents.items}
            columns={3}
            itemSize={1}
            spacing={4}
            cardDescriptionClass="textMuted"
            cardDescriptionAlign="left"
            cardTitleAlign="left"
          />
        </Box>

        <Box mt={8}>
          <EventCardGrid
            title="Otros eventos"
            eventCards={theaterEvents.items}
            columns={4}
            itemSize={2}
            spacing={4}
            cardDescriptionClass="textMuted"
            cardDescriptionAlign="left"
            cardTitleAlign="left"
          />
        </Box>
      </main>
    </div>
  );
}
