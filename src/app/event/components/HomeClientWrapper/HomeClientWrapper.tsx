"use client";

import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCarousel from "@/components/EventCarousel/EventCarousel";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import Loader from "@/components/Loader/Loader";
import SeasonBanner from "@/components/SeasonBanner/SeasonBanner";
import { EventItemDTO, mapEventToCardVM } from "@/models/event-item.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { SeasonItemDTO } from "@/models/season-item.dto";
import {
  getEvents,
  getMainEvents,
  getTrendingEvents,
} from "@/services/eventService";
import { getSeasonBanner } from "@/services/seasonService";
import { colors } from "@/theme/colors";

export default function HomeClientWrapper() {
  const [mainEvents, setMainEvents] = useState<PagedResponse<EventItemDTO>>();
  const [trendingEvents, setTrendingEvents] =
    useState<PagedResponse<EventItemDTO>>();
  const [futbolEvents, setFutbolEvents] =
    useState<PagedResponse<EventItemDTO>>();
  const [musicEvents, setMusicEvents] = useState<PagedResponse<EventItemDTO>>();
  const [theaterEvents, setTheaterEvents] =
    useState<PagedResponse<EventItemDTO>>();
  const [seasonBanner, setSeasonBanner] = useState<SeasonItemDTO>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          mainResponse,
          trendingResponse,
          futbolResponse,
          musicResponse,
          theaterResponse,
          seasonResponse
        ] = await Promise.all([
          getMainEvents(),
          getTrendingEvents({ page: 1, pageSize: 6 }),
          getEvents({ page: 1, eventCategoryId: 1, pageSize: 3 }),
          getEvents({ page: 1, eventCategoryId: 2, pageSize: 3 }),
          getEvents({ page: 1, eventCategoryId: 3, pageSize: 3 }),
          getSeasonBanner()
        ]);

        setMainEvents(mainResponse);
        setTrendingEvents(trendingResponse);
        setFutbolEvents(futbolResponse);
        setMusicEvents(musicResponse);
        setTheaterEvents(theaterResponse);
        setSeasonBanner(seasonResponse);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {mainEvents && (
        <FullWidthSection fullBleed={true} disableMaxWidth={true}>
          <EventCarousel events={mainEvents.items} />
        </FullWidthSection>
      )}
      {trendingEvents && (
        <Grid container columns={12} mt={6} mb={5}>
          <Grid size={12}>
            <EventCardGrid
              title="Eventos destacados"
              eventCards={trendingEvents.items.map(mapEventToCardVM)}
              sizeVariant="sm"
              styleVariant="default"
              showCardBadge={true}
            />
          </Grid>
        </Grid>
      )}

      {futbolEvents && (
        <FullWidthSection
          variant="imageFull"
          image="/assets/images/separators/soccer-separator-light.png"
        >
          <Box sx={{ paddingBottom: 6, paddingTop: 6 }}>
            <EventCardGrid
              title="Fútbol"
              eventCards={futbolEvents.items.map(mapEventToCardVM)}
              sizeVariant="lg"
              styleVariant="dark"
              showCardBadge={true}
            />
          </Box>
        </FullWidthSection>
      )}
      {musicEvents && (
        <Box mt={6} mb={3}>
          <EventCardGrid
            title="Música"
            eventCards={musicEvents.items.map(mapEventToCardVM)}
            sizeVariant="lg"
            styleVariant="muted"
          />
        </Box>
      )}

      {seasonBanner &&
        <SeasonBanner seasonItem={seasonBanner} />
      }

      {theaterEvents && (
        <FullWidthSection
          variant="color"
          backgroundColor={colors.brand.background}
          fullBleed={false}
        >
          <Box mt={8} mb={6.5}>
            <EventCardGrid
              title="Otros eventos"
              eventCards={theaterEvents.items.map(mapEventToCardVM)}
              sizeVariant="md"
              styleVariant="muted"
              showCardBadge={true}
            />
          </Box>
        </FullWidthSection>
      )}

      <Loader isLoading={isLoading} />
    </Box>
  );
}
