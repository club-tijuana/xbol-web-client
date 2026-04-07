"use client";

import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetState } from "@/store/slices/bookingSlice";

import styles from "./HoldExpiredModal.module.scss";

export default function HoldExpiredModal() {
    const dispatch = useAppDispatch();
    const holdTokenStatus = useAppSelector(state => state.bookingFlow.holdTokenObj?.status);
    const router = useRouter();

    const handleGoHome = async () => {
        await dispatch(resetState());
        router.push("/");
    }

    const handleRetry = async () => {
        await dispatch(resetState());
        window.location.reload();
    }

    return (
        <Dialog
            open={holdTokenStatus === "expired"}
            slotProps={{ paper: { className: styles.modal } }}
        >
            <Box className={styles.content} px={4}>
                <Typography variant="h6" gutterBottom>
                    Tiempo de reserva expirado
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Tu hold token ha expirado y los asientos seleccionados han sido liberados.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button variant="outlined" color="primary" onClick={handleGoHome}>
                        Ir al inicio
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleRetry}>
                        Intentar nueva reservación
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
}