"use client";

import { Alert, Box, Grid, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCarousel from "@/components/EventCarousel/EventCarousel";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import Loader from "@/components/Loader/Loader";
import SeasonBanner from "@/components/SeasonBanner/SeasonBanner";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { EventItemDTO, mapEventToCardVM } from "@/models/event-item.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { SeasonItemDTO } from "@/models/season-item.dto";
import {
  getEvents,
  getMainEvents,
  getTrendingEvents,
} from "@/services/eventService";
import { getSeasonBanner } from "@/services/seasonService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories } from "@/store/slices/eventsFilterSlice";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

export default function HomeClientWrapper() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const generalMessage = useAppSelector(state => state.ui.generalMessage);
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
          getTrendingEvents({ page: 1, pageSize: 5 }),
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
        dispatch(showGeneralMessage({
          message: getErrorMessage(error),
          severity: "error"
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGoToFilter = async (categoryId: number) => {
    await dispatch(setCategories([categoryId]));

    router.push(`/event`);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {(mainEvents && mainEvents.items.length > 0) && (
        <FullWidthSection fullBleed={true} disableMaxWidth={true}>
          <EventCarousel events={mainEvents.items} />
        </FullWidthSection>
      )}
      {(trendingEvents && trendingEvents.items.length > 0) && (
        <Grid container columns={12}>
          <Grid size={12}>
            <EventCardGrid
              title="Eventos destacados"
              eventCards={trendingEvents.items.map(e =>
                mapEventToCardVM(e)
              )}
              sizeVariant="sm"
              styleVariant="default"
              showCardBadge={true}
            />
          </Grid>
        </Grid>
      )}

      {(futbolEvents && futbolEvents.items.length > 0) && (
        <FullWidthSection
          variant="color"
          backgroundColor={colors.brand.secondary}
          topRounded={true}
          bottomRounded={true}
          hideOverflow={false}
        >
          <EventCardGrid
            title="Fútbol"
            eventCards={futbolEvents.items.map(e =>
              mapEventToCardVM(e)
            )}
            sizeVariant="lg"
            styleVariant="dark"
            showCardBadge={true}
            showCardInfo={false}
            onSeeAllAction={() => handleGoToFilter(1)}
          />
        </FullWidthSection>
      )}
      {(musicEvents && musicEvents.items.length > 0) && (
        <Box>
          <EventCardGrid
            title="Música"
            eventCards={musicEvents.items.map(e =>
              mapEventToCardVM(e)
            )}
            sizeVariant="lg"
            styleVariant="muted"
            onSeeAllAction={() => handleGoToFilter(2)}
          />
        </Box>
      )}

      {seasonBanner &&
        <SeasonBanner seasonItem={seasonBanner} />
      }

      {(theaterEvents && theaterEvents.items.length > 0) && (
        <FullWidthSection
          variant="color"
          backgroundColor={colors.ui.surface}
          topRounded={true}
          hideOverflow={false}
        >
          <EventCardGrid
            title="Teatro"
            eventCards={theaterEvents.items.map(e =>
              mapEventToCardVM(e)
            )}
            sizeVariant="lg"
            styleVariant="light"
            onSeeAllAction={() => handleGoToFilter(3)}
          />
        </FullWidthSection>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!generalMessage.message}
        autoHideDuration={4000}
        onClose={() => dispatch(clearGeneralMessage())}>
        <Alert
          severity={generalMessage.severity}
          variant="filled"
          sx={{ width: "100%" }}>
          {generalMessage.message}
        </Alert>
      </Snackbar>
      <Loader isLoading={isLoading} />
    </Box>
  );
}
