"use client";

import { ArrowDownwardOutlined, FilterAlt, TrendingUp } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, Chip, FormControl, FormControlLabel, Grid, Input, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useRef, useState } from "react";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { EventCategoryDTO } from "@/models/event-category.dto";
import { getEventCategories } from "@/services/eventService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories, setRangeDateFrom, setRangeDateTo, setTextFilter, setTrendingEvents } from "@/store/slices/eventsFilterSlice";
import { showGeneralMessage } from "@/store/slices/uiSlice";

export default function AccordionFilters() {
    const isMounted = useRef(false);
    const dispatch = useAppDispatch();
    const filters = useAppSelector(store => store.eventsFilters.filters);

    const [textFilterInput, setTextFilterInput] = useState(filters.searchTerm || "");
    const [categoriesDto, setCategoriesDto] = useState<EventCategoryDTO[]>([]);

    const debouncedTextFilter = useDebounce(textFilterInput, 500);

    useEffect(() => {
        dispatch(setTextFilter(debouncedTextFilter));
    }, [debouncedTextFilter, dispatch]);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const getCategories = async () => {
            try {
                const result = await getEventCategories();
                setCategoriesDto(result);
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
        };

        getCategories();
    }, [dispatch]);

    const handleFromDate = (date: Date | null) => {
        dispatch(setRangeDateFrom(date ? date.toISOString() : null));
    };

    const handleToDate = (date: Date | null) => {
        dispatch(setRangeDateTo(date ? date.toISOString() : null));
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

    return (
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
                    padding: 0
                }}
                aria-controls="filters-content"
                id="filters-header"
            >
                <Typography component="span" variant="h3" color="text">
                    Filtrar eventos
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ textAlign: "left" }}>
                <Grid container columns={3}>
                    <Grid size={1}>
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
                    </Grid>
                    <Grid size={1}>
                        <Box sx={{ mr: 5 }}>
                            <Typography variant="bodyLg" color={'text'} mt={2}>
                                Categoría
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ overflowX: "auto", mt: 1 }}
                            >
                                {categoriesDto.map(category => (
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
                    </Grid>
                    <Grid size={1}>
                        <Box>
                            <Typography variant="bodyLg" color={'text'} mt={2}>
                                Rango de fechas
                            </Typography>
                            <Box display="flex" sx={{ mt: 1 }}>
                                {typeof window !== "undefined" && (
                                    <DatePicker
                                        value={filters.rangeDateFrom ? new Date(filters.rangeDateFrom) : null}
                                        maxDate={filters.rangeDateTo ? new Date(filters.rangeDateTo) : undefined}
                                        slotProps={{
                                            textField: { variant: "standard" },
                                            field: { clearable: true }
                                        }}
                                        sx={{ mr: 2 }}
                                        onChange={handleFromDate}
                                    />
                                )}

                                {typeof window !== "undefined" && (
                                    <DatePicker
                                        value={filters.rangeDateTo ? new Date(filters.rangeDateTo) : null}
                                        minDate={filters.rangeDateFrom ? new Date(filters.rangeDateFrom) : undefined}
                                        slotProps={{
                                            textField: { variant: "standard" },
                                            field: { clearable: true }
                                        }}
                                        onChange={handleToDate}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={1}>
                        <Box mt={2}>
                            <FormControlLabel
                                onChange={(e, checked) => dispatch(setTrendingEvents(checked))}
                                control={<Checkbox />}
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        Eventos más buscados
                                        <TrendingUp fontSize="small" />
                                    </Box>
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}