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
    cardTitleClass,
    cardDescriptionAlign = "left",
    cardDescriptionClass
}: EventCardGridProps) {
    return (
        <>
            <Typography 
                variant="h4" 
                className={`textPrimary`}
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
                            titleClass={cardTitleClass}
                            descriptionAlign={cardDescriptionAlign}
                            descriptionClass={cardDescriptionClass} 
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}