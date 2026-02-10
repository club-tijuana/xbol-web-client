import { Box, Grid } from "@mui/material";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCrousel from "@/components/EventCarousel/EventCarousel";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { EventCategory } from "@/models/enums/event-category.enum";
import { getEvents, getMainEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";

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

        <Grid container columns={12} mt={6} mb={5}>
          <Grid size={12}>
            <EventCardGrid
              title="Eventos destacados"
              titleAlign="center"
              eventCards={mainEvents.items}
              columns={6}
              itemSize={1}
              spacing={3}
              size="sm"
              cardTitleColor={colors.light.text}
              showCardBadge={true}
              cardBadgeType="dark"
            />
          </Grid>
        </Grid>

        <FullWidthSection backgroundImage="/assets/images/separators/soccer-separator-light.png" ignoreParentPadding={false}>
          <Box sx={{ paddingBottom: 6, paddingTop: 6 }}>
            <EventCardGrid
              title="Fútbol"
              eventCards={futbolEvents.items}
              columns={3}
              itemSize={1}
              spacing={4}
              cardDescriptionAlign="left"
              cardTitleAlign="left"
              cardTitleColor={colors.light.primary}
              showCardBadge={true}
            />
          </Box>
        </FullWidthSection>

        <Box mt={6} mb={3}>
          <EventCardGrid
            title="Música"
            eventCards={musicEvents.items}
            columns={3}
            itemSize={1}
            spacing={4}
            cardDescriptionAlign="left"
            cardTitleAlign="left"
            cardTitleColor={colors.light.secondary}
            cardDescriptionColor={colors.light.muted}
          />
        </Box>


        <FullWidthSection backgroundColor={colors.brand.background} ignoreParentPadding={false}>
          <Box mt={8} mb={6.5}>
            <EventCardGrid
              title="Otros eventos"
              eventCards={theaterEvents.items}
              columns={4}
              itemSize={1}
              spacing={4}
              cardDescriptionAlign="left"
              cardTitleAlign="left"
              cardTitleColor={colors.light.secondary}
              cardDescriptionColor={colors.light.muted}
              showCardBadge={true}
              cardBadgeType="dark"
            />
          </Box>
        </FullWidthSection>
      </main>
    </div>
  );
}
