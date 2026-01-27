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
    cardDescriptionAlign = "left",
    cardDescriptionClass
}: EventCardGridProps) {
    return (
        <>
            <Typography 
                variant="h5" 
                className={`textPrimary textBold`} 
                fontSize={29} 
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
                            descriptionClass={cardDescriptionClass} 
                            titleAlign={cardTitleAlign} 
                            descriptionAlign={cardDescriptionAlign} 
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}