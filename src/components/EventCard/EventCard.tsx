"use client";

import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { colors } from "@/theme/colors";
import { EventCategoryLabel } from "@/utils/eventCategory.mapper";

import styles from "./EventCard.module.scss";
import { EventCardProps } from "./EventCard.type";

export default function EventCard({
    eventCard,
    size,
    titleColor,
    titleAlign,
    descriptionColor,
    descriptionAlign = "left",
    showBadge = false,
    badgeType = "light",
    showActions = true,
    imageHeight
}: EventCardProps) {
    const router = useRouter();
    const { posterImageUrl, name, startDate, location, category } = eventCard;
    const date = new Date(startDate);

    const handleClick = () => {
        const id = eventCard.id;
        if (!id) {
            return;
        }

        router.push(`/event/${id}`)
    }

    return (
        <Card className={styles.card}>
            <Box position={'relative'}>
                <CardMedia
                    component="img"
                    image={posterImageUrl}
                    alt={name}
                    height={imageHeight === undefined ? 200 : imageHeight}
                    sx={{
                        borderRadius: 1
                    }}
                />
                {
                    showBadge &&
                    <Chip
                        label={EventCategoryLabel[category]}
                        color={badgeType === "light" ? "primary" : "secondary"}
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            maxWidth: "100%",
                            width: size === "sm" ? "100%" : "auto",
                            fontWeight: 400,
                            fontSize: 22,
                            color: 'white',
                            borderRadius: 1,
                            height: 45,
                            paddingLeft: 1.3,
                            paddingRight: 1.3,
                            "& .MuiChip-label": {
                                fontSize: size === "lg" ? 22 : 20,
                                fontWeight: 400,
                                color: badgeType === "light" ? colors.light.neutral : colors.light.primary,
                            },
                        }}
                    />
                }
            </Box>
            <CardContent>
                <Typography variant="h3"
                    fontWeight={700}
                    color={titleColor === undefined ? colors.light.neutral : titleColor}
                    className={`${styles.title}`}
                    textAlign={titleAlign}
                    height={70}
                    alignContent={'center'}
                >
                    {name}
                </Typography>
                {size === "lg" &&
                    <Typography variant="h4" fontWeight={400} color={descriptionColor === undefined ? colors.light.neutral : descriptionColor} textAlign={descriptionAlign}>
                        {date.toLocaleDateString("ex-MX", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        })}
                    </Typography>
                }
                {size === "lg" &&
                    <Typography variant="h4" fontWeight={400} color={descriptionColor === undefined ? colors.light.neutral : descriptionColor} textAlign={descriptionAlign}>
                        {location}
                    </Typography>
                }
            </CardContent>
            {
                showActions &&
                <CardActions sx={{ paddingTop: 0, justifySelf: size === "lg" ? 'left' : 'center' }}>
                    <Button variant="outlined" onClick={handleClick}>
                        <Typography variant="body1" px={1.3} py={1}>
                            Ver tickets
                        </Typography>
                    </Button>
                </CardActions>
            }

        </Card>
    );
}