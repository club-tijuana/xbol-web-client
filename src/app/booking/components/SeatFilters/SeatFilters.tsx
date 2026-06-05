"use client";

import { ArrowDownwardOutlined, TuneOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import Loader from "@/components/Loader/Loader";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { PriceRange, ReservationFilters } from "@/models/filters/reservation-filters.dto";
import { ZoneDTO } from "@/models/zone.dto";
import { getSeatsAvailability, getZonesBySchedule, getZonesBySeason } from "@/services/bookingService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetFilters } from "@/store/slices/eventsFilterSlice";
import { showGeneralMessage } from "@/store/slices/uiSlice";
import { mapPricing } from "@/utils/mappers/seatsSectionPrices.mapper";

import PriceRangeFilter from "../PriceRangeFilter/PriceRangeFilter";

import { SeatFiltersProps } from "./SeatFilters.type";

export default function SeatFilters({ scheduleId, seasonId, buttonText, onZoneChange, onZoneSelected }: SeatFiltersProps) {
    const dispatch = useAppDispatch();
    const bookingMode = useAppSelector(store => store.bookingFlow.bookMode);
    const [filters, setFilters] = useState<ReservationFilters>({
        scheduleId: (!bookingMode || bookingMode === "event") ? scheduleId : undefined,
        seasonId: (bookingMode === "season" || bookingMode === "renovateSeason") ? scheduleId : undefined
    });
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState<ZoneDTO[]>([]);

    const debouncedFilters = useDebounce(filters, 600);

    useEffect(() => {
        const loadZones = async () => {
            try {
                if (scheduleId) {
                    const result = await getZonesBySchedule(scheduleId);
                    setZones(result);
                }
                else if (seasonId) {
                    const result = await getZonesBySeason(seasonId);
                    setZones(result);
                }
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
        };

        loadZones();

        return () => {
            dispatch(resetFilters());
        }
    }, [scheduleId, seasonId, dispatch]);

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            scheduleId: (!bookingMode || bookingMode === "event") ? scheduleId : undefined,
            seasonId: (bookingMode === "season" || bookingMode === "renovateSeason") ? seasonId : undefined
        }))
    }, [bookingMode, scheduleId, seasonId]);

    useEffect(() => {
        const loadSections = async () => {
            setLoading(true);
            try {
                const result = await getSeatsAvailability(debouncedFilters);
                setZones(result.zones);

                if (onZoneChange) {
                    const sectionPrices = mapPricing(result);
                    if (sectionPrices) {
                        onZoneChange(sectionPrices);
                    }
                }
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
            finally {
                setLoading(false);
            }
        };

        loadSections();
    }, [debouncedFilters, onZoneChange]);

    const handlePriceRangeChange = useCallback((priceRange: PriceRange) => {
        setFilters((prev) => ({
            ...prev,
            priceRange,
        }));
    }, []);

    const handleZoneSelected = (zoneLabel: string) => {
        onZoneSelected?.(zoneLabel);
    };

    return (
        <Paper elevation={3} className="paperCard" sx={{ width: "100%", backgroundColor: "white" }}>
            <Accordion elevation={0}>
                <AccordionSummary
                    expandIcon={
                        <Box display="flex" alignItems="center" gap={1}>
                            <ArrowDownwardOutlined className="arrowIcon" fontSize="small" />
                            <Typography variant="subtitle1" color="text">
                                Más cerca
                            </Typography>
                            <TuneOutlined color="primary" />
                        </Box>
                    }
                    sx={{
                        px: 0,
                        backgroundColor: "white",
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
                    <Typography component="span" variant="h4" color="primary">
                        Selecciona tus asientos
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "white" }}>
                    <Box display="flex" flexDirection="row">
                        <Typography variant="subtitle1" color="secondary" mr={4}>
                            Precios
                        </Typography>
                        <PriceRangeFilter
                            value={filters.priceRange}
                            onChange={handlePriceRangeChange}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Box sx={{ backgroundColor: "white" }}>
                {zones?.filter(zone => zone.price !== null).map((zone, index) => (
                    <Box key={zone.id}>
                        <Grid container columns={12} pb={3.5}>
                            <Grid size={4}>
                                <Typography variant="subtitle2" color="primary">
                                    {zone.name}
                                </Typography>
                            </Grid>
                            <Grid size={3} textAlign={"right"}>
                                {zone.price &&
                                    <Typography variant="subtitle2" fontWeight={400} color="secondary">
                                        {formatCurrency(zone.price)}
                                    </Typography>
                                }
                                <Typography variant="body1" color="secondary">
                                    + Impuestos
                                </Typography>
                            </Grid>
                            <Grid size={5} textAlign={"right"}>
                                <Button variant="outlined" size="medium" onClick={() => handleZoneSelected(zone.displayName)}>
                                    {buttonText}
                                </Button>
                            </Grid>
                        </Grid>
                        {(index + 1) !== zones.length && <Divider sx={{ borderWidth: 1, borderColor: 'var(--color-primary)' }} />}
                    </Box>
                ))}
            </Box>
            <Loader isLoading={loading} />
        </Paper>
    );
}