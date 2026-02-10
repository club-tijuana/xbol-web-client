"use client";

import { Grid, Typography } from "@mui/material";

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
    cardImageHeight
}: EventCardGridProps) {
    return (
        <>
            <Typography
                variant="h2"
                color="primary"
                textAlign={titleAlign}
            >
                {title}
            </Typography>
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