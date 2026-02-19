"use client";

import { Button, Grid, Typography } from "@mui/material";

import { ResponsiveNumber } from "@/types/responsive";

import EventCard from "../EventCard/EventCard";

import { EventCardGridProps } from "./EventCardGrid.type";

type SizeVariant = EventCardGridProps["sizeVariant"];

interface StyleConfig {
    spacing: number;
}

const columnsByVariant: Record<SizeVariant, ResponsiveNumber> = {
    xs: { xs: 2, sm: 3, md: 2, lg: 4, xl: 4 },
    sm: { xs: 2, sm: 3, md: 4, lg: 6, xl: 6 },
    md: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
    lg: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
};

const spacingConfig: Record<SizeVariant, StyleConfig> = {
    xs: { spacing: 2.5 },
    sm: { spacing: 3 },
    md: { spacing: 4 },
    lg: { spacing: 4 },
};

export default function EventCardGrid({
    title,
    eventCards,
    sizeVariant = "lg",
    styleVariant,
    showCardBadge = false,
    showCardActions = true,
}: EventCardGridProps) {
    const currentColumnsConfig = columnsByVariant[sizeVariant];
    const currentSpacingConfig = spacingConfig[sizeVariant];

    return (
        <>
            <Grid container columns={2}>
                <Grid size={(sizeVariant === "md" || sizeVariant === "lg") ? 1 : 2}>
                    <Typography
                        variant="h2"
                        color="primary"
                        textAlign={sizeVariant === "sm" ? "center" : "left"}
                    >
                        {title}
                    </Typography>
                </Grid>
                {
                    (sizeVariant === "md" || sizeVariant === "lg") &&
                    <Grid size={1} textAlign={'end'}>
                        <Button variant="outlined" sx={{ borderRadius: 0, py: 1.2, px: 4 }}>
                            <Typography variant="body2" fontWeight={700}>
                                Ver todos
                            </Typography>
                        </Button>
                    </Grid>
                }
            </Grid >
            <Grid container
                columns={currentColumnsConfig}
                spacing={currentSpacingConfig.spacing}
                alignItems="center"
                mt={3}
            >
                {eventCards.map((event) => (
                    <Grid key={event.id} size={1}>
                        <EventCard
                            eventCard={event}
                            sizeVariant={sizeVariant}
                            styleVariant={styleVariant}
                            showBadge={showCardBadge}
                            showActions={showCardActions}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}