"use client";

import { TrendingUp } from "@mui/icons-material";
import { Box, Checkbox, Chip, FormControl, FormControlLabel, Grid, Input, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { EventCategoryDTO } from "@/models/event-category.dto";
import PickersProvider from "@/providers/PickersProvider";
import { getEventCategories } from "@/services/eventService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories, setRangeDateFrom, setRangeDateTo, setTextFilter, setTrendingEvents } from "@/store/slices/eventsFilterSlice";
import { showGeneralMessage } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

export default function EventsFilters() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(store => store.eventsFilters.filters);

    const [textFilterInput, setTextFilterInput] = useState(filters.searchTerm || "");
    const [categoriesDto, setCategoriesDto] = useState<EventCategoryDTO[]>([]);

    const debouncedTextFilter = useDebounce(textFilterInput, 500);

    useEffect(() => {
        dispatch(setTextFilter(debouncedTextFilter));
    }, [debouncedTextFilter, dispatch]);

    useEffect(() => {
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
        <Box>
            <Typography component="span" variant="h2" color="text">
                Filtrar
            </Typography>
            <Grid container columns={3}>
                <Grid size={1}>
                    <Box sx={{ mr: 5 }}>
                        <Typography variant="subtitle1" color="secondary" mt={2}>
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
                                    '&:after': { borderBottom: '2px solid var(--color-secondary)' },
                                }}
                                value={textFilterInput}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                <Grid size={1}>
                    <Box sx={{ mr: 5 }}>
                        <Typography variant="subtitle1" color="secondary" mt={2}>
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
                        <Typography variant="subtitle1" color="secondary" mt={2}>
                            Rango de fechas
                        </Typography>
                        <PickersProvider>
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
                        </PickersProvider>
                    </Box>
                </Grid>
                <Grid size={1}>
                    <Box mt={2}>
                        <FormControlLabel
                            onChange={(e, checked) => dispatch(setTrendingEvents(checked))}
                            control={<Checkbox />}
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: colors.text.tertiary }}>
                                    Eventos más buscados
                                    <TrendingUp fontSize="small" />
                                </Box>
                            }
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
