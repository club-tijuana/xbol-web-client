"use client";

import { ArrowDownwardOutlined, TuneOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";

import { ReservationFilters } from "@/models/filters/reservation-filters.dto";

interface SeatSelectionProps {
    scheduleId: number;
}

export default function SeatSelection({ scheduleId }: SeatSelectionProps) {
    const [filters, setFilters] = useState<ReservationFilters>({
        scheduleId: scheduleId
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
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
                    <Box>

                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
}