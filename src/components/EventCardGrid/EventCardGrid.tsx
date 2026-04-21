"use client";

import { Box, Button, Grid, Typography } from "@mui/material";

import { colors } from "@/theme/colors";
import { ResponsiveNumber } from "@/types/responsive";
import { StyleVariant } from "@/types/variants";

import EventCard from "../EventCard/EventCard";

import { EventCardGridProps } from "./EventCardGrid.type";

/* -------------------- CONSTANTS -------------------- */
const LARGE_VARIANTS: EventCardGridProps["sizeVariant"][] = ["md", "lg"];

/* -------------------- CONFIGS -------------------- */
type SizeVariant = EventCardGridProps["sizeVariant"];

interface VariantStyleConfig {
    color: string;
    backgroundColor: string;
    listMt: number;
}

interface SpacingConfig {
    spacing: number;
}

const columnsByVariant: Record<SizeVariant, ResponsiveNumber> = {
    xs: { xs: 2, sm: 3, md: 2, lg: 3, xl: 5 },
    sm: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    md: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
    lg: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
};

const spacingConfig: Record<SizeVariant, SpacingConfig> = {
    xs: { spacing: 2.5 },
    sm: { spacing: 3 },
    md: { spacing: 4 },
    lg: { spacing: 2 },
};

const styleConfig: Partial<Record<StyleVariant, VariantStyleConfig>> = {
    default: {
        color: "primary",
        backgroundColor: colors.brand.tertiary,
        listMt: 12
    },
    dark: {
        color: "white",
        backgroundColor: colors.brand.primary,
        listMt: 1
    },
    muted: {
        color: "primary",
        backgroundColor: colors.ui.surface,
        listMt: 1
    },
    light: {
        color: "white",
        backgroundColor: colors.brand.primary,
        listMt: 1
    }
};

/* -------------------- COMPONENT -------------------- */
export default function EventCardGrid({
    title,
    eventCards,
    sizeVariant = "lg",
    styleVariant,
    showCardBadge = false,
    showCardInfo = true,
    showAllButton = true,
    onSeeAllAction
}: EventCardGridProps) {
    const currentColumnsConfig = columnsByVariant[sizeVariant];
    const currentSpacingConfig = spacingConfig[sizeVariant];
    const currentStyle = styleConfig[styleVariant] ?? styleConfig.default;

    const isLarge = LARGE_VARIANTS.includes(sizeVariant);

    return (
        <Box>
            {title &&
                <Grid container columns={2} position="relative" mb={currentStyle?.listMt}>
                    {title &&
                        <Grid size={2} display="flex" position={"relative"} justifyContent="center"
                            sx={{
                                position: "absolute",
                                top: -30,
                                zIndex: 1000,
                                width: "100%"
                            }}
                        >
                            <Typography
                                variant="h3"
                                color={currentStyle?.color}
                                textAlign="center"
                                sx={{
                                    backgroundColor: currentStyle?.backgroundColor,
                                    width: 600,
                                    py: 1.5,
                                    borderRadius: 7
                                }}
                            >
                                {title}
                            </Typography>
                        </Grid>
                    }
                    {
                        (isLarge && showAllButton) &&
                        <Grid size={2} textAlign={'end'} mt={7}>
                            <Button variant="text" sx={{
                                borderRadius: 0,
                                py: 1.2,
                                px: 4
                            }}
                                onClick={onSeeAllAction}
                            >
                                <Typography variant="body1"
                                    sx={{
                                        borderBottomStyle: "solid",
                                        borderBottomWidth: 1
                                    }}
                                >
                                    Ver todos
                                </Typography>
                            </Button>
                        </Grid>
                    }
                </Grid>
            }
            <Grid container
                columns={currentColumnsConfig}
                spacing={currentSpacingConfig.spacing}
                alignItems="center"
                sx={{ pb: 10, pt: 1 }}
            >
                {eventCards.map((event) => (
                    <Grid key={event.eventId + (event.scheduleId ? ("-" + event.scheduleId) : "")} size={1}>
                        <EventCard
                            eventCard={event}
                            sizeVariant={sizeVariant}
                            styleVariant={styleVariant}
                            showBadge={showCardBadge}
                            showInfo={showCardInfo}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}