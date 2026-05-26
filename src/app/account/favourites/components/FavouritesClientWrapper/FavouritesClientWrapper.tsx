"use client";

import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { EventItemDTO, mapEventToCardVM } from "@/models/event-item.dto";
import { getClientFavorites } from "@/services/clientFavoriteEventService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showGeneralMessage } from "@/store/slices/uiSlice";

//----------- CONSTANTS -------------
const PAGE_SIZE: number = 9;

export default function FavouritesClientWrapper() {
    const dispatch = useAppDispatch();
    const favouriteIds = useAppSelector(
        state => state.favouriteEvents.eventIds
    );
    const [favouriteEvents, setFavouriteEvents] = useState<EventItemDTO[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(0);
    const filteredEvents = favouriteEvents.filter(
        event => favouriteIds[event.id]
    );

    const loadEvents = async (loadMore?: boolean) => {
        try {
            const nextPage = currentPage + (loadMore ? 1 : 0);

            const response = await getClientFavorites(nextPage, PAGE_SIZE);

            if (loadMore) {
                setCurrentPage(prev => prev + 1);
            }

            if (response) {
                setFavouriteEvents(prev => [...(prev ?? []), ...response.items]);
            }
        } catch (error) {
            dispatch(showGeneralMessage({
                message: getErrorMessage(error),
                severity: "error"
            }));
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getClientFavorites(currentPage, PAGE_SIZE);

                if (response) {
                    setTotalPages(response.totalPages);
                    setFavouriteEvents(response.items);
                }
            } catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
        };

        load();
    }, []);

    return (
        <Box sx={{ minHeight: "100vh" }} pt={10} mt={20}>
            <EventCardGrid
                title="Favoritos"
                eventCards={filteredEvents.map(e =>
                    mapEventToCardVM(e)
                )}
                sizeVariant="lg"
                styleVariant="default"
                showAllButton={false}
                showCardBadge={true}
            />
            {(currentPage !== totalPages && filteredEvents.length > 0) &&
                <Box textAlign="center">
                    <Button variant="outlined" color="primary" sx={{ my: 4 }} onClick={() => { loadEvents(true) }}>
                        <Typography variant="body1" py={1} px={3}>
                            Ver más
                        </Typography>
                    </Button>
                </Box>
            }
        </Box>
    );
}