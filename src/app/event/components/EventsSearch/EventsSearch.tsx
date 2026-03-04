"use client";

import { ArrowDownwardOutlined, FilterAlt, HighlightOffRounded } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, FormControl, Grid, IconButton, Input, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { useDebounce } from "@/hooks/useDebounce";
import { EventItemDTO } from "@/models/event-item.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { PerformerDTO } from "@/models/performer.dto";
import { getFilteredEvents } from "@/services/eventService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories, setPage, setTextFilter, setPerformerId } from "@/store/slices/eventsFilterSlice";

import { EventsSearchProps } from "./EventsSearch.types";

export default function EventsSearch({ eventCategories }: EventsSearchProps) {
    const dispatch = useAppDispatch();
    const isMounted = useRef(false);
    const filters = useAppSelector(store => store.eventsFilters.filters);
    const [textFilterInput, setTextFilterInput] = useState(filters.textFilter || "");
    const [currentPage, setCurrentPage] = useState<PagedResponse<EventItemDTO>>();
    const [events, setEvents] = useState<EventItemDTO[]>([]);
    const [performers, setPerformers] = useState<PerformerDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedTextFilter = useDebounce(textFilterInput, 500);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const filter = async () => {
            setIsLoading(true);

            try {
                const result = await getFilteredEvents(filters);

                if (filters.page === 1) {
                    setPerformers(result.performers);
                    setEvents(result.pagedEvents.items);
                }
                else {
                    setPerformers(result.performers);
                    setEvents(prev => [...prev, ...result.pagedEvents.items]);
                }

                setCurrentPage(result.pagedEvents);
            }
            catch {
                // TODO: Implement error handler
            }
            finally {
                setIsLoading(false);
            }
        };

        filter();
    }, [filters]);

    useEffect(() => {
        dispatch(setTextFilter(debouncedTextFilter));
    }, [debouncedTextFilter, dispatch]);

    const handleLoadMore = () => {
        if (filters.page !== currentPage?.totalPages) {
            dispatch(setPage(filters.page + 1));
        }
    };

    const handleCategoryChange = (categoryId: number) => {
        const exists = filters.eventCategoryIds?.includes(categoryId);

        if (exists) {
            const filtered = filters.eventCategoryIds?.filter(id => id !== categoryId);

            dispatch(setCategories(filtered));
        }
        else {
            dispatch(setCategories([
                ...(filters.eventCategoryIds ?? []),
                categoryId
            ]));
        }
    };

    const handlePerformerClick = (performerId: number | undefined) => {
        setTextFilterInput('');
        dispatch(setTextFilter(''));
        dispatch(setPerformerId(performerId));
    };

    return (
        <Box textAlign="center">
            <Accordion elevation={0} sx={{ backgroundColor: "transparent" }}>
                <AccordionSummary
                    expandIcon={
                        <Box display="flex" alignItems="center" gap={1}>
                            <ArrowDownwardOutlined className="arrowIcon" fontSize="small" />
                            <Typography variant="body2" color="text">
                                Filtros
                            </Typography>
                            <FilterAlt color="primary" />
                        </Box>
                    }
                    sx={{
                        "& .MuiAccordionSummary-expandIconWrapper": {
                            transform: "none",
                        },
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                            transform: "none",
                        },

                        "& .MuiAccordionSummary-expandIconWrapper .arrowIcon": {
                            transition: "transform 0.3s ease",
                        },
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded .arrowIcon": {
                            transform: "rotate(180deg)",
                        },
                    }}
                    aria-controls="filters-content"
                    id="filters-header"
                >
                    <Typography component="span" variant="h3" color="text">
                        Filtrar eventos
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box textAlign="left" display="flex" flexDirection="row">
                        <Box sx={{ mr: 5 }}>
                            <Typography variant="bodyLg" color={'text'} mt={2}>
                                Título/Lugar
                            </Typography>
                            <FormControl fullWidth variant="filled" sx={{ mt: 1 }}>
                                <Input
                                    id="textFilter"
                                    type={'text'}
                                    inputProps={{
                                        style: {
                                            fontSize: 16
                                        }
                                    }}
                                    onChange={(e) => setTextFilterInput(e.target.value)}
                                    sx={{
                                        backgroundColor: 'white',
                                        '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                                    }}
                                    value={textFilterInput}
                                />
                            </FormControl>
                        </Box>

                        <Box>
                            <Typography variant="bodyLg" color={'text'} mt={2}>
                                Categoría
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ overflowX: "auto", mt: 1 }}
                            >
                                {eventCategories.map(category => (
                                    <Chip
                                        key={category.id}
                                        label={category.displayName}
                                        variant={filters.eventCategoryIds?.includes(category.id) ? "filled" : "outlined"}
                                        color={filters.eventCategoryIds?.includes(category.id) ? "primary" : "default"}
                                        clickable
                                        onClick={() => handleCategoryChange(category.id)}
                                        sx={{
                                            color: filters.eventCategoryIds?.includes(category.id) ? "white" : "black",
                                            padding: 2,
                                            fontSize: 16
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {(performers && performers.length > 0) &&
                <Box>
                    <Typography variant="h3" textAlign="left" mb={2}>
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
                                            image={p.imageUrl}
                                            alt={p.name}
                                        />
                                        <CardContent>
                                            <Typography variant="h5" color="text">
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

            {(events && events.length > 0) &&
                <Typography variant="h3" textAlign="left" mt={5}>
                    Eventos
                </Typography>
            }
            <EventCardGrid
                eventCards={events}
                sizeVariant="lg"
                styleVariant="default"
                showCardBadge={true}
                showCardActions={false}
                showAllButton={false}
            />

            {isLoading &&
                <Grid container columns={3} spacing={4}>
                    <Grid size={1}>
                        <Skeleton variant="rectangular" sx={{ width: "100%", height: 200 }} />
                        <Box sx={{ pt: 4 }}>
                            <Skeleton height={50} />
                            <Skeleton height={45} width="40%" />
                            <Skeleton height={45} width="60%" />
                        </Box>
                    </Grid>
                    <Grid size={1}>
                        <Skeleton variant="rectangular" sx={{ width: "100%", height: 200 }} />
                        <Box sx={{ pt: 4 }}>
                            <Skeleton height={50} />
                            <Skeleton height={45} width="40%" />
                            <Skeleton height={45} width="60%" />
                        </Box>
                    </Grid>
                    <Grid size={1}>
                        <Skeleton variant="rectangular" sx={{ width: "100%", height: 200 }} />
                        <Box sx={{ pt: 4 }}>
                            <Skeleton height={50} />
                            <Skeleton height={45} width="40%" />
                            <Skeleton height={45} width="60%" />
                        </Box>
                    </Grid>
                </Grid>
            }

            {(filters.page !== currentPage?.totalPages && events.length > 0) &&
                <Button variant="outlined" color="primary" sx={{ my: 4 }} onClick={handleLoadMore}>
                    <Typography variant="body1" py={1} px={3}>
                        Ver más
                    </Typography>
                </Button>
            }
        </Box>
    );
}