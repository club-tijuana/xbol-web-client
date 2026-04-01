"use client";

import {
  ConfirmationNumberOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { colors } from "@/theme/colors";
import { ResponsiveNumber } from "@/types/responsive";

import FavoriteButton from "../FavoriteButton/FavoriteButton";

import styles from "./EventCard.module.scss";
import { EventCardProps } from "./EventCard.type";

/* -------------------- CONSTANTS -------------------- */
const SMALL_VARIANTS: EventCardProps["sizeVariant"][] = ["xs", "sm"];
const LARGE_VARIANTS: EventCardProps["sizeVariant"][] = ["md", "lg"];

/* -------------------- CONFIGS -------------------- */
type SizeVariant = EventCardProps["sizeVariant"];
type StyleVariant = EventCardProps["styleVariant"];
type BadgeType = "light" | "dark";

interface StyleConfig {
  titleColor: string;
  descriptionColor: string;
  badgeType: BadgeType;
}

const imageHeightsByVariant: Record<SizeVariant, ResponsiveNumber> = {
  xs: { xs: 200, sm: 200, md: 180, lg: 130, xl: 140 },
  sm: { xs: 180, sm: 210, md: 220, lg: 190, xl: 200 },
  md: { xs: 200, sm: 200, md: 170, lg: 145, xl: 145 },
  lg: { xs: 240, sm: 170, md: 170, lg: 210, xl: 200 },
};

const styleConfig: Record<StyleVariant, StyleConfig> = {
  default: {
    titleColor: colors.light.text,
    descriptionColor: colors.light.text,
    badgeType: "dark",
  },
  muted: {
    titleColor: colors.light.muted,
    descriptionColor: colors.light.muted,
    badgeType: "dark",
  },
  dark: {
    titleColor: colors.light.primary,
    descriptionColor: colors.light.neutral,
    badgeType: "light",
  },
  schedule: {
    titleColor: colors.light.text,
    descriptionColor: colors.light.text,
    badgeType: "dark",
  },
};

const actionStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

/* -------------------- COMPONENT -------------------- */
export default function EventCard({
  eventCard,
  sizeVariant,
  styleVariant,
  showBadge = false,
  showActions = true,
}: EventCardProps) {
  const router = useRouter();
  const { posterImageUrl, name, startDate, location, categories } = eventCard;

  const [mouseOver, setMouseOver] = useState(false);

  const currentSizeConfig = imageHeightsByVariant[sizeVariant];
  const currentStyleConfig = styleConfig[styleVariant];

  const isSmall = SMALL_VARIANTS.includes(sizeVariant);
  const isLarge = LARGE_VARIANTS.includes(sizeVariant);

  const handleClick = () => {
    const id = eventCard.eventId;
    if (!id) return;

    router.push(`/event/${id}`);
  };

  const handleBuyTickets = () => {
    router.push(`/booking/${eventCard.scheduleId}`);
  };

  return (
    <Card className={styles.card}>
      <Box
        position={"relative"}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        {mouseOver && styleVariant === "schedule" && (
          <Box className={styles.overlay}>
            <Box sx={actionStyle} mr={3}>
              <IconButton
                aria-label="Ver"
                color="primary"
                onClick={handleClick}
              >
                <VisibilityOutlined sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="caption" fontWeight={700} color="neutral">
                Ver
              </Typography>
            </Box>
            <Box sx={actionStyle}>
              <IconButton
                aria-label="Ver"
                color="primary"
                onClick={handleBuyTickets}
              >
                <ConfirmationNumberOutlined sx={{ fontSize: 45 }} />
              </IconButton>
              <Typography variant="caption" fontWeight={700} color="neutral">
                Comprar tickets
              </Typography>
            </Box>
          </Box>
        )}
        <CardMedia
          onClick={
            !showActions && styleVariant !== "schedule" ? handleClick : () => { }
          }
          component="img"
          image={posterImageUrl}
          alt={name}
          sx={{
            height: currentSizeConfig,
            borderRadius: 1,
            cursor: showActions ? "auto" : "pointer",
          }}
        />
        {showBadge && (
          <Chip
            label={categories[0].displayName}
            color={
              currentStyleConfig.badgeType === "light" ? "primary" : "secondary"
            }
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              maxWidth: "100%",
              width: isSmall ? "100%" : "auto",
              fontWeight: 400,
              fontSize: 22,
              color: "white",
              borderRadius: 1,
              height: 45,
              paddingLeft: 1.3,
              paddingRight: 1.3,
              "& .MuiChip-label": {
                fontSize: isLarge ? 22 : 20,
                fontWeight: 400,
                color:
                  currentStyleConfig.badgeType === "light"
                    ? colors.light.neutral
                    : colors.light.primary,
              },
            }}
          />
        )}
      </Box>
      <CardContent>
        <Typography
          variant="h3"
          fontWeight={700}
          color={currentStyleConfig.titleColor}
          className={`${styles.title}`}
          textAlign={isSmall ? "center" : "left"}
          sx={{
            height: 60,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
        {isLarge && (
          <Typography
            variant="h4"
            fontWeight={400}
            color={currentStyleConfig.descriptionColor}
            textAlign="left"
          >
            {startDate}
          </Typography>
        )}
        {isLarge && (
          <Typography
            variant="h4"
            fontWeight={400}
            color={currentStyleConfig.descriptionColor}
            textAlign="left"
          >
            {location}
          </Typography>
        )}
      </CardContent>
      {showActions && (
        <CardActions sx={{ paddingTop: 0 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: isLarge ? "space-between" : "center",
              gap: isLarge ? 0 : 2,
            }}
          >
            <Button variant="outlined" onClick={handleClick}>
              Ver tickets
            </Button>

            <FavoriteButton
              eventId={eventCard.eventId}
              colorBorder="primary"
            />
          </Box>
        </CardActions>
      )}
    </Card>
  );
}
