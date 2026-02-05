"use client";

import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import styles from "./EventCard.module.scss";
import { EventCardProps } from "./EventCard.type";

export default function EventCard({ eventCard, size, titleClass, titleAlign, descriptionClass, descriptionAlign = "left" }: EventCardProps) {
    const router = useRouter();
    const { posterImageUrl, name, startDate, location } = eventCard;
    const date = new Date(startDate);

    return (
        <Card className={styles.card}>
            <CardActionArea onClick={() => router.push(`/event/${eventCard.id}`)}>
                <CardMedia
                    component="img"
                    image={posterImageUrl}
                    alt={name}
                />
                <CardContent>
                    <Typography variant="xl2" className={`${titleClass} ${styles.title}`} textAlign={titleAlign}>
                        {name}
                    </Typography>
                    {size === "lg" &&
                        <Typography variant="h5" className={`${descriptionClass}`} textAlign={descriptionAlign}>
                            {date.toLocaleDateString("ex-MX", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            })}
                        </Typography>
                    }
                    {size === "lg" &&
                        <Typography variant="h5" className={`${descriptionClass}`} textAlign={descriptionAlign}>
                            {location}
                        </Typography>
                    }
                </CardContent>
            </CardActionArea>
        </Card>
    );
}