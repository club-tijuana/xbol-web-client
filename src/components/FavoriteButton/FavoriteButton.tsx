"use client";

import { Star, StarBorder } from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";
import { useState } from "react";

import { toggleFavorite } from "@/services/clientFavoriteEventService";

interface Props {
  eventId: number;
  initialFavorite: boolean;
  colorBorder: SvgIconProps["color"];
}

export default function FavoriteButton({
  eventId,
  initialFavorite,
  colorBorder,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleToggleFavorite = async () => {
    const previous = isFavorite;
    setIsFavorite(!previous);

    try {
      const result = await toggleFavorite(eventId);
      setIsFavorite(result.isFavorite);
    } catch {
      setIsFavorite(previous);
    }
  };

  return (
    <span onClick={handleToggleFavorite} style={{ cursor: "pointer" }}>
      {isFavorite ? (
        <Star color="primary" fontSize="large" />
      ) : (
        <StarBorder color={colorBorder} fontSize="large" />
      )}
    </span>
  );
}
