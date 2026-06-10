"use client";

import {
  CalendarTodayOutlined,
  ConfirmationNumberOutlined,
  LocationOnOutlined,
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
  Theme,
  Typography,
  TypographyVariant,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { eventImageOrDefault } from "@/models/event-image";
import { colors } from "@/theme/colors";
import { ResponsiveNumber } from "@/types/responsive";

import FavoriteButton from "../FavoriteButton/FavoriteButton";

import styles from "./EventCard.module.scss";
import { EventCardProps } from "./EventCard.type";

/* -------------------- CONSTANTS -------------------- */
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

interface CardInfoVariantConfig {
  titleVariant: TypographyVariant;
  dateVariant: TypographyVariant;
  locationVariant: TypographyVariant;
  imageMb: ResponsiveNumber;
  titleMb: ResponsiveNumber;
  titleHeight: string | number;
}

const cardInfoVariant: Record<SizeVariant, CardInfoVariantConfig> = {
  xs: {
    titleVariant: "h4",
    dateVariant: "subtitle1",
    locationVariant: "subtitle1",
    imageMb: 0,
    titleMb: 1,
    titleHeight: 61
  },
  sm: {
    titleVariant: "h4",
    dateVariant: "h5",
    locationVariant: "h5",
    imageMb: 2,
    titleMb: 0,
    titleHeight: 60
  },
  md: {
    titleVariant: "h4",
    dateVariant: "h5",
    locationVariant: "h5",
    imageMb: 2,
    titleMb: 2,
    titleHeight: 40
  },
  lg: {
    titleVariant: "h4",
    dateVariant: "h5",
    locationVariant: "h5",
    imageMb: 2,
    titleMb: 2,
    titleHeight: 40
  },
};

const styleConfig: Record<StyleVariant, StyleConfig> = {
  default: {
    titleColor: colors.text.primary,
    descriptionColor: colors.text.tertiary,
    badgeType: "dark",
  },
  muted: {
    titleColor: colors.text.primary,
    descriptionColor: colors.text.tertiary,
    badgeType: "dark",
  },
  dark: {
    titleColor: colors.text.primary,
    descriptionColor: colors.text.neutral,
    badgeType: "light",
  },
  light: {
    titleColor: colors.text.primary,
    descriptionColor: colors.text.tertiary,
    badgeType: "dark",
  },
  schedule: {
    titleColor: colors.text.tertiary,
    descriptionColor: colors.text.tertiary,
    badgeType: "dark",
  },
};

const actionStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const getChipStyle = (
  badgeType: BadgeType
): SxProps<Theme> => ({
  position: "relative",
  bottom: 0,
  right: 0,
  top: 0,
  maxWidth: "100%",
  width: "100%",
  fontWeight: 400,
  fontSize: "20px",
  color: "white",
  borderTopRightRadius: 10,
  borderTopLeftRadius: 10,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
  height: 45,
  paddingLeft: 1.3,
  paddingRight: 1.3,
  "& .MuiChip-label": {
    fontSize: "20px",
    fontWeight: 400,
    color:
      badgeType === "light"
        ? colors.text.tertiary
        : colors.text.primary,
  },
});

/* -------------------- COMPONENT -------------------- */
export default function EventCard({
  eventCard,
  sizeVariant,
  styleVariant,
  showBadge = false,
  showInfo = true,
}: EventCardProps) {
  const router = useRouter();
  const { posterImageUrl, name, startDate, location, categories } = eventCard;

  const [mouseOver, setMouseOver] = useState(false);

  const currentStyleConfig = styleConfig[styleVariant];
  const currentCardInfoVariant = cardInfoVariant[sizeVariant];

  const isLarge = LARGE_VARIANTS.includes(sizeVariant);

  const handleClick = () => {
    const id = eventCard.eventId;
    if (!id) return;

    router.push(eventCard.detailHref ?? `/event/${id}`);
  };

  const handleBuyTickets = () => {
    router.push(`/booking/${eventCard.scheduleId}`);
  };

  return (
    <Card className={styles.card} sx={{ position: "relative" }}>
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
        {(showBadge && categories && categories.length > 0) && (
          <Chip
            label={categories[0].displayName}
            color={
              currentStyleConfig.badgeType === "light" ? "primary" : "secondary"
            }
            sx={getChipStyle(currentStyleConfig.badgeType)}
          />
        )}
        <CardMedia
          onClick={styleVariant !== "schedule" ? handleClick : () => { }}
          image={eventImageOrDefault(posterImageUrl)}
          sx={{
            aspectRatio: (sizeVariant === "xs" || sizeVariant === "sm") ? "1 / 1" : "16 / 9",
            borderTopRightRadius: showBadge ? 0 : 10,
            borderTopLeftRadius: showBadge ? 0 : 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            cursor: "auto",
            mb: currentCardInfoVariant.imageMb,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </Box>
      {showInfo &&
        <CardContent sx={{ px: 0 }}>
          <Typography
            variant={currentCardInfoVariant.titleVariant}
            color={currentStyleConfig.titleColor}
            className={`${styles.title}`}
            textAlign={"left"}
            mb={currentCardInfoVariant.titleMb}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
              height: currentCardInfoVariant.titleHeight,
            }}
          >
            {name}
          </Typography>
          {showInfo && (
            <Typography
              variant={currentCardInfoVariant.dateVariant}
              color={currentStyleConfig.descriptionColor}
              textAlign="left"
              display={"flex"}
              alignItems={"center"}
              sx={{
                height: 65
              }}
            >
              <CalendarTodayOutlined color="primary" sx={{ mr: 1 }} />
              {startDate}
            </Typography>
          )}
          {showInfo && (
            <Typography
              variant={currentCardInfoVariant.locationVariant}
              color={currentStyleConfig.descriptionColor}
              textAlign="left"
              display={"flex"}
              alignItems={"center"}
            >
              <LocationOnOutlined color="primary" sx={{ mr: 1 }} />
              {location}
            </Typography>
          )}
        </CardContent>
      }
      <CardActions sx={{ paddingTop: 0, px: 0, }}>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={isLarge ? 0 : 3}
        >
          <Button variant="outlined" size="medium" onClick={handleClick}>
            Ver tickets
          </Button>

          <Box sx={{
            position: sizeVariant === "xs" ? "absolute" : "static",
            right: 2,
            top: 2
          }}>
            <FavoriteButton
              eventId={eventCard.eventId}
              colorBorder="primary"
            />
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
}
