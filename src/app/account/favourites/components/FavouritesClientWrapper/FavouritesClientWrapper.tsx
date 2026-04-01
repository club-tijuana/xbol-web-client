"use client";

import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { EventItemDTO, mapEventToCardVM } from "@/models/event-item.dto";
import { getClientFavorites } from "@/services/clientFavoriteEventService";
import { useAppSelector } from "@/store/hooks";

//----------- CONSTANTS -------------
const PAGE_SIZE: number = 9;

export default function FavouritesClientWrapper() {
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
        } catch { }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getClientFavorites(currentPage, PAGE_SIZE);

                if (response) {
                    setTotalPages(response.totalPages);
                    setFavouriteEvents(response.items);
                }
            } catch { }
        };

        load();
    }, []);

    return (
        <Box sx={{ minHeight: "100vh" }} pt={10}>
            <EventCardGrid
                title="Favoritos"
                eventCards={filteredEvents.map(mapEventToCardVM)}
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