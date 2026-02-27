"use client";

import { ArrowDownwardOutlined, FilterAlt } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, FormControl, Grid, Input, InputLabel, MenuItem, Select, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import { useDebounce } from "@/hooks/useDebounce";
import { EventCategory, EventCategoryLabels } from "@/models/enums/event-category.enum";
import { EventItemDTO } from "@/models/event-item.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { getEvents } from "@/services/eventService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategory, setPage, setTextFilter } from "@/store/slices/eventsFilterSlice";

export default function EventsSearch() {
    const dispatch = useAppDispatch();
    const isMounted = useRef(false);
    const filters = useAppSelector(store => store.eventsFilters.filters);
    const [textFilterInput, setTextFilterInput] = useState(filters.textFilter || "");
    const [currentPage, setCurrentPage] = useState<PagedResponse<EventItemDTO>>();
    const [events, setEvents] = useState<EventItemDTO[]>([]);
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
                const result = await getEvents(filters);

                if (filters.page === 1) {
                    setEvents(result.items);
                }
                else {
                    setEvents(prev => [...prev, ...result.items]);
                }

                setCurrentPage(result);
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

    const handleCategoryChange = (category: EventCategory) => {
        if (filters.eventCategory === category) {
            dispatch(setCategory(null));
        }
        else {
            dispatch(setCategory(category));
        }
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
                                {Object.values(EventCategory).filter(v => typeof v === "number").map(value => (
                                    <Chip
                                        key={value}
                                        label={EventCategoryLabels[value as EventCategory]}
                                        variant={filters.eventCategory === value ? "filled" : "outlined"}
                                        color={filters.eventCategory === value ? "primary" : "default"}
                                        clickable
                                        onClick={() => handleCategoryChange(value)}
                                        sx={{
                                            color: filters.eventCategory === value ? "white" : "black",
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

            {filters.page !== currentPage?.totalPages &&
                <Button variant="outlined" color="primary" sx={{ my: 4 }} onClick={handleLoadMore}>
                    <Typography variant="body1" py={1} px={3}>
                        Ver más
                    </Typography>
                </Button>
            }
        </Box>
    );
}