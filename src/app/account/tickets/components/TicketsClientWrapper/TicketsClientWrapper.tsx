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
    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!token) {
            return;
        }

        async function load() {
            isFetchingRef.current = true;

            try {
                const events = await getMyEvents({ page: currentEventsPage, pageSize: PAGE_SIZE, orderType: OrderType.Ticket });
                const seasons = await getMyEvents({ page: currentSeasonPage, pageSize: PAGE_SIZE, orderType: OrderType.Bundle });

                setMyEvents(events?.items ?? []);
                setMySeasons(seasons?.items ?? []);
            }
            finally {
                isFetchingRef.current = false;
            }
        }

        load();
    }, [token]);

    const loadMoreSeasons = async () => {
        if (isFetchingRef.current) {
            return;
        }

        isFetchingRef.current = true;

        try {
            const response = await getMyEvents({ page: (currentSeasonPage + 1), pageSize: PAGE_SIZE, orderType: OrderType.SeasonPass });

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