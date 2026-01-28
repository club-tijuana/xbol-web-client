"use client";

import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { EventCardProps } from "./EventCard.type";
import styles from "./EventCard.module.scss";

export default function EventCard({ eventCard, size, titleAlign, descriptionClass, descriptionAlign = "left" }: EventCardProps) {
    const { image, title, dateStr, location } = eventCard;
    
    return (
        <Card className={styles.card}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                />
                <CardContent>
                    <Typography variant="xl2" className={`textPrimary ${styles.title}`} textAlign={titleAlign}>
                        { title }
                    </Typography>
                    { size === "lg" &&
                        <Typography variant="h5" className={`${descriptionClass}`} textAlign={descriptionAlign}>
                            { dateStr }
                        </Typography>
                    }
                    { size === "lg" &&
                        <Typography variant="h5" className={`${descriptionClass}`} textAlign={descriptionAlign}>
                            { location }
                        </Typography>
                    }
                </CardContent>
            </CardActionArea>
        </Card>
    );
}