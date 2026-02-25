"use client";

import { ArrowDownwardOutlined, TuneOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { PriceRange, ReservationFilters } from "@/models/filters/reservation-filters.dto";
import { SectionDTO } from "@/models/section.dto";
import { ZoneDTO } from "@/models/zone.dto";
import { getSeatsAvailability, getZonesBySchedule } from "@/services/bookingService";

import PriceRangeFilter from "../PriceRangeFilter/PriceRangeFilter";

import { SeatFiltersProps } from "./SeatFilters.type";

export default function SeatFilters({ scheduleId, onSectionSelected }: SeatFiltersProps) {
    const [filters, setFilters] = useState<ReservationFilters>({
        scheduleId: scheduleId
    });
    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState<SectionDTO[]>([]);
    const [zones, setZones] = useState<ZoneDTO[]>([]);

    const debouncedFilters = useDebounce(filters, 600);

    useEffect(() => {
        const loadZones = async () => {
            try {
                const result = await getZonesBySchedule(scheduleId);
                setZones(result);
            }
            catch {
                // TODO: Implement error handler
            }
        };

        loadZones();
    }, [scheduleId]);

    useEffect(() => {
        const loadSections = async () => {
            setLoading(true);
            try {
                const result = await getSeatsAvailability(debouncedFilters);
                setSections(result);
            }
            catch {
                // TODO: Implement error handler
            }
            finally {
                setLoading(false);
            }
        };

        loadSections();
    }, [debouncedFilters]);

    const handlePriceRangeChange = useCallback((priceRange: PriceRange) => {
        setFilters((prev) => ({
            ...prev,
            priceRange,
        }));
    }, []);

    const handleZoneChange = (zoneId: number) => {
        let _zoneId: number | undefined;

        if (zoneId === filters.zoneId) {
            _zoneId = undefined;
        }
        else {
            _zoneId = zoneId;
        }

        setFilters((prev) => ({
            ...prev,
            zoneId: _zoneId
        }));
    };

    const handleSectionSelected = (section: string) => {
        onSectionSelected?.(section);
    };

    return (
        <Paper elevation={3} className="paperCard" sx={{ width: "100%" }}>
            <Accordion elevation={0}>
                <AccordionSummary
                    expandIcon={
                        <Box display="flex" alignItems="center" gap={1}>
                            <ArrowDownwardOutlined className="arrowIcon" fontSize="small" />
                            <Typography variant="body2" color="text">
                                Más cerca
                            </Typography>
                            <TuneOutlined color="primary" />
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
                    <Typography component="span" variant="h6" fontWeight={400} color="primary">
                        Selecciona tus asientos
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display="flex" flexDirection="row">
                        <Typography variant="h6" fontWeight={400} mr={4}>
                            Precios
                        </Typography>
                        <PriceRangeFilter
                            value={filters.priceRange}
                            onChange={handlePriceRangeChange}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" mt={3}>
                        <Typography variant="h6" fontWeight={400}>
                            Tipo de boleto
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={8}
                            sx={{
                                overflowX: "auto"
                            }}
                        >
                            {zones.map(zone => (
                                <Chip
                                    key={zone.id}
                                    label={zone.name}
                                    variant={(filters.zoneId && filters.zoneId === zone.id) ? "filled" : "outlined"}
                                    color={(filters.zoneId && filters.zoneId === zone.id) ? "primary" : "default"}
                                    clickable={true}
                                    onClick={() => handleZoneChange(zone.id)}
                                    sx={{
                                        color: (filters.zoneId && filters.zoneId === zone.id) ? "white" : "black",
                                        padding: 2,
                                        fontSize: 16
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Box sx={{ backgroundColor: "white" }}>
                {sections?.map((section, index) => (
                    <Box key={section.id}>
                        <Grid container columns={12} py={3.5}>
                            <Grid size={4}>
                                <Typography variant="h6" color="primary">
                                    Sección {section.name}
                                </Typography>
                            </Grid>
                            <Grid size={2} textAlign={"right"}>
                                <Typography variant="h6" fontWeight={400} color="muted">
                                    {section.price}
                                </Typography>
                                <Typography variant="caption" color="muted">
                                    + Impuestos
                                </Typography>
                            </Grid>
                            <Grid size={6} textAlign={"right"}>
                                <Button variant="outlined" onClick={() => handleSectionSelected(section.name)}>
                                    <Typography variant="body1" px={1.3} py={1}>
                                        Ver tickets
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                        {(index + 1) !== sections.length && <Divider sx={{ borderWidth: 1, borderColor: 'var(--color-text-primary)' }} />}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}