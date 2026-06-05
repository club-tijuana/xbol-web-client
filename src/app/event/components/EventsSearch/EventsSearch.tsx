"use client";

import { HighlightOffRounded } from "@mui/icons-material";
import { Alert, Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Skeleton, Snackbar, SxProps, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { PerformerDTO } from "@/models/performer.dto";
import { mapScheduleToCardVM, ScheduleItemDTO } from "@/models/schedule-item.dto";
import { EventCardVM } from "@/models/views/event-card.vm";
import { getFilteredEvents } from "@/services/eventService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    resetFilters,
    setPage,
    setTextFilter,
    setPerformerId,
} from "@/store/slices/eventsFilterSlice";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

import EventsFilters from "../EventsFilters/EventsFilters";

/* -------------------- CONSTANTS -------------------- */
const FALLBACK_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE ?? "";

const skeletonStyle: SxProps = {
    width: "100%",
    height: 290,
    backgroundColor: colors.brand.tertiary,
    opacity: 0.1
};

const skeletonColorStyle: SxProps = {
    backgroundColor: colors.brand.tertiary,
    opacity: 0.1
}

export default function EventsSearch() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const generalMessage = useAppSelector(state => state.ui.generalMessage);
    const filters = useAppSelector(store => store.eventsFilters.filters);
    const [currentPage, setCurrentPage] = useState<PagedResponse<ScheduleItemDTO>>();
    const [schedules, setSchedules] = useState<EventCardVM[]>([]);
    const [performers, setPerformers] = useState<PerformerDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const filter = async () => {
            setIsLoading(true);

            try {
                const result = await getFilteredEvents(filters);

                if (filters.page === 1) {
                    if (result.pagedEvents.items.length === 1) {
                        const item = result.pagedEvents.items[0];
                        router.push(`/event/${item.event.id}`);
                        dispatch(resetFilters());
                    }

                    const items = result.pagedEvents.items.map(mapScheduleToCardVM);
                    setPerformers(result.performers);
                    setSchedules(items);
                }
                else {
                    const items = result.pagedEvents.items.map(mapScheduleToCardVM);
                    setPerformers(result.performers);
                    setSchedules(prev => [...prev, ...items]);
                }

                setCurrentPage(result.pagedEvents);
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
            finally {
                setIsLoading(false);
            }
        };

        filter();
    }, [filters, dispatch, router]);

    const handleLoadMore = () => {
        if (filters.page !== currentPage?.totalPages) {
            dispatch(setPage(filters.page + 1));
        }
    };

    const handlePerformerClick = (performerId: number | undefined) => {
        dispatch(setTextFilter(''));
        dispatch(setPerformerId(performerId));
    };

    return (
        <Box>
            <EventsFilters />

            {(performers && performers.length > 0) &&
                <Box>
                    <Typography variant="h2" textAlign="left" mb={2}>
                        Artistas
                    </Typography>
                    <Grid container columns={4} spacing={3}>
                        {performers.map((p, index) => (
                            <Grid key={index} size={1}>
                                <Card sx={{ position: "relative" }}>
                                    <IconButton sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }} color="primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePerformerClick(undefined);
                                        }}
                                    >
                                        <HighlightOffRounded />
                                    </IconButton>
                                    <CardActionArea onClick={() => handlePerformerClick(p.id)}>
                                        <CardMedia
                                            component="img"
                                            image={p.imageUrl?.trim() || FALLBACK_IMAGE}
                                            alt={p.name}
                                        />
                                        <CardContent>
                                            <Typography variant="h5" color="secondary">
                                                {p.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            }

            {(schedules && schedules.length > 0) &&
                <Box mt={5} display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="h2" textAlign="left">
                        Eventos
                    </Typography>
                    <Typography variant="h6" textAlign="right">
                        {schedules.length}/{currentPage?.totalCount}
                    </Typography>
                </Box>
            }
            <EventCardGrid
                eventCards={schedules}
                sizeVariant="lg"
                styleVariant="schedule"
                showCardBadge={true}
                showAllButton={false}
            />

            {isLoading &&
                <Grid container columns={4} spacing={2}>
                    <Grid size={1}>
                        <Skeleton variant="rectangular" sx={{ width: "100%", height: 290 }} style={{ backgroundColor: colors.brand.tertiary, opacity: 0.1 }} />
                        <Box sx={{ pt: 4 }}>
                            <Skeleton height={50} sx={skeletonColorStyle} />
                            <Skeleton height={45} width="40%" sx={skeletonColorStyle} />
                            <Skeleton height={45} width="60%" sx={skeletonColorStyle} />
                        </Box>
                    </Grid>
                    <Grid size={1}>
                        <Skeleton variant="rectangular" sx={skeletonStyle} />
                        <Box sx={{ pt: 4 }}>
                            <Skeleton height={50} sx={skeletonColorStyle} />
                            <Skeleton height={45} width="40%" sx={skeletonColorStyle} />
                            <Skeleton height={45} width="60%" sx={skeletonColorStyle} />
                        </Box>
                    </Grid>
                    <Grid size={1}>
                        <Skeleton variant="rectangular" sx={skeletonStyle} />
                        <Box sx={{ pt: 4 }}>
                            <Skeleton height={50} sx={skeletonColorStyle} />
                            <Skeleton height={45} width="40%" sx={skeletonColorStyle} />
                            <Skeleton height={45} width="60%" sx={skeletonColorStyle} />
                        </Box>
                    </Grid>
                    <Grid size={1}>
                        <Skeleton variant="rectangular" sx={skeletonStyle} />
                        <Box sx={{ pt: 4 }}>
                            <Skeleton height={50} sx={skeletonColorStyle} />
                            <Skeleton height={45} width="40%" sx={skeletonColorStyle} />
                            <Skeleton height={45} width="60%" sx={skeletonColorStyle} />
                        </Box>
                    </Grid>
                </Grid>
            }

            {(filters.page !== currentPage?.totalPages && schedules.length > 0) &&
                <Button variant="outlined" color="primary" sx={{ my: 4 }} onClick={handleLoadMore}>
                    <Typography variant="body1" py={1} px={3}>
                        Ver más
                    </Typography>
                </Button>
            }

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