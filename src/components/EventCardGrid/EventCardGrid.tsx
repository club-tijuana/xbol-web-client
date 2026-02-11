"use client";

import { Button, Grid, Typography } from "@mui/material";

import EventCard from "../EventCard/EventCard";

import { EventCardGridProps } from "./EventCardGrid.type";

export default function EventCardGrid({
    title,
    titleAlign = "left",
    columns,
    spacing,
    itemSize,
    eventCards,
    size = "lg",
    cardTitleAlign = "center",
    cardTitleColor,
    cardDescriptionAlign = "left",
    cardDescriptionColor,
    showCardBadge = false,
    cardBadgeType = "light",
    showCardActions = true,
    cardImageHeight,
    showAllButton = false
}: EventCardGridProps) {
    return (
        <>
            <Grid container columns={2}>
                <Grid size={showAllButton ? 1 : 2}>
                    <Typography
                        variant="h2"
                        color="primary"
                        textAlign={titleAlign}
                    >
                        {title}
                    </Typography>
                </Grid>
                {
                    showAllButton &&
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
                columns={columns}
                spacing={spacing}
                alignItems="center"
                mt={3}
            >
                {eventCards.map((event) => (
                    <Grid key={event.id} size={itemSize}>
                        <EventCard
                            eventCard={event}
                            size={size}
                            titleAlign={cardTitleAlign}
                            titleColor={cardTitleColor}
                            descriptionAlign={cardDescriptionAlign}
                            descriptionColor={cardDescriptionColor}
                            showBadge={showCardBadge}
                            badgeType={cardBadgeType}
                            showActions={showCardActions}
                            imageHeight={cardImageHeight}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}