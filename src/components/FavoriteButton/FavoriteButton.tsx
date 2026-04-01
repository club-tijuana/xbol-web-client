"use client";

import { Star, StarBorder } from "@mui/icons-material";
import { Alert, Box, Snackbar, SvgIconProps } from "@mui/material";
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");

  const handleToggleFavorite = async () => {
    const previous = isFavorite;
    setIsFavorite(!previous);

    try {
      const result = await toggleFavorite(eventId);

      setIsFavorite(result.isFavorite);
      setAlertSeverity("success");
      setSnackbarMessage(
        result.isFavorite ? "Evento marcado como favorito."
          : "Evento removido de favoritos."
      );
      setOpenSnackbar(true);
    } catch {
      setIsFavorite(previous);
      setAlertSeverity("error");
      setSnackbarMessage(
        "Error al marcar/desmarcar el evento como favorito."
      );
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <span onClick={handleToggleFavorite} style={{ cursor: "pointer" }}>
        {isFavorite ? (
          <Star color="primary" fontSize="large" />
        ) : (
          <StarBorder color={colorBorder} fontSize="large" />
        )}
      </span>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={5000}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
