"use client";

import { Alert, Box, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { OrderType } from "@/models/enums/order-type.enum";
import { MyEventDTO } from "@/models/my-event.dto";
import { getMyEvents } from "@/services/accountService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";

import TicketTabs from "../TicketTabs/TicketTabs";

//----------- CONSTANTS -------------
const PAGE_SIZE: number = 10;

export default function TicketsClientWrapper() {
  const generalMessage = useAppSelector(state => state.ui.generalMessage);
  const token = useAppSelector(state => state.auth.user?.token);
  const dispatch = useAppDispatch();

  const [myEvents, setMyEvents] = useState<MyEventDTO[]>([]);
  const [mySeasons, setMySeasons] = useState<MyEventDTO[]>([]);
  const [currentEventsPage, setCurrentEventsPage] = useState<number>(1);
  const [currentSeasonPage, setCurrentSeasonPage] = useState<number>(1);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [seasonsLoaded, setSeasonsLoaded] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [seasonsError, setSeasonsError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function load() {
      isFetchingRef.current = true;

      try {
        setEventsError(null);
        setSeasonsError(null);
        setCurrentEventsPage(1);
        setCurrentSeasonPage(1);

        const [eventsResult, seasonsResult] = await Promise.allSettled([
          getMyEvents({ page: 1, pageSize: PAGE_SIZE, orderType: OrderType.Ticket }),
          getMyEvents({ page: 1, pageSize: PAGE_SIZE, orderType: OrderType.Bundle }),
        ]);

        if (eventsResult.status === "fulfilled") {
          setMyEvents(eventsResult.value?.items ?? []);
        }
        else if (eventsResult.status === "rejected") {
          const message = getErrorMessage(eventsResult.reason);
          setEventsError(message);
          dispatch(showGeneralMessage({
            message,
            severity: "error"
          }));
        }

        if (seasonsResult.status === "fulfilled") {
          setMySeasons(seasonsResult.value?.items ?? []);
        }
        else if (seasonsResult.status === "rejected") {
          const message = getErrorMessage(seasonsResult.reason);
          setSeasonsError(message);
          dispatch(showGeneralMessage({
            message,
            severity: "error"
          }));
        }

        setEventsLoaded(true);
        setSeasonsLoaded(true);
      }
      finally {
        isFetchingRef.current = false;
      }
    }

    load();
  }, [token, dispatch]);

  const loadMoreSeasons = async () => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      const response = await getMyEvents({ page: (currentSeasonPage + 1), pageSize: PAGE_SIZE, orderType: OrderType.Bundle });

      if (response) {
        setCurrentSeasonPage(prev => prev + 1);
        setMySeasons(prev => [...(prev ?? []), ...response.items])
      }
    }
    catch (error) {
      dispatch(showGeneralMessage({
        message: getErrorMessage(error),
        severity: "error"
      }));
    }
    finally {
      isFetchingRef.current = false;
    }
  };

  const loadMoreEvents = async () => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      const response = await getMyEvents({ page: (currentEventsPage + 1), pageSize: PAGE_SIZE, orderType: OrderType.Ticket });

      if (response) {
        setCurrentEventsPage(prev => prev + 1);
        setMyEvents(prev => [...(prev ?? []), ...response.items])
      }
    }
    catch (error) {
      dispatch(showGeneralMessage({
        message: getErrorMessage(error),
        severity: "error"
      }));
    }
    finally {
      isFetchingRef.current = false;
    }
  };

  return (
    <Box>
      <TicketTabs
        myEvents={myEvents}
        mySeasons={mySeasons}
        eventsLoaded={eventsLoaded}
        seasonsLoaded={seasonsLoaded}
        eventsError={eventsError}
        seasonsError={seasonsError}
        onEventLoadMore={loadMoreEvents}
        onSeasonLoadMore={loadMoreSeasons}
      />

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
    </Box>
  );
}
