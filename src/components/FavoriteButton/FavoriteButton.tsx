"use client";

import { Star, StarBorder } from "@mui/icons-material";
import { Alert, Box, Snackbar, SvgIconProps } from "@mui/material";
import { useState } from "react";

import { toggleFavorite } from "@/services/clientFavoriteEventService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavourite as toggleFavouriteSlice } from "@/store/slices/favouriteEventSlice";

interface Props {
  eventId: number;
  //initialFavorite: boolean;
  colorBorder: SvgIconProps["color"];
}

export default function FavoriteButton({
  eventId,
  //initialFavorite,
  colorBorder,
}: Props) {
  //const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(
    state => !!state.favouriteEvents.eventIds[eventId]
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");

  const handleToggleFavorite = async () => {
    dispatch(toggleFavouriteSlice(eventId));

    try {
      await toggleFavorite(eventId);

      setAlertSeverity("success");
      setSnackbarMessage(`Evento ${isFavorite ? 'desmarcado' : 'marcado'} como favorito correctamente.`);
    } catch {
      dispatch(toggleFavouriteSlice(eventId));

      setAlertSeverity("error");
      setSnackbarMessage(`Error al ${isFavorite ? 'desmarcar' : 'marcar'} el evento como favorito.`);
    }

    setOpenSnackbar(true);
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
