"use client";

import { Alert, AlertTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { expireHoldToken } from "@/store/slices/bookingFlowSlice";

export default function HoldTokenTimer() {
    const dispatch = useAppDispatch();
    const holdTokenObj = useAppSelector(state => state.bookingFlow.holdTokenObj);
    const holdTokenStatus = useAppSelector(state => state.bookingFlow.holdTokenObj?.status);

    const [timeLeft, setTimeLeft] = useState(
        holdTokenObj?.expiresInSeconds ?? 0
    );

    useEffect(() => {
        if (!holdTokenObj || holdTokenStatus === "expired") return;

        const resetTimer = setTimeout(() => {
            setTimeLeft(holdTokenObj.expiresInSeconds);
        }, 0);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    dispatch(expireHoldToken({ type: "auto" }));
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(resetTimer);
        };
    }, [holdTokenObj, holdTokenStatus]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(1, "0");
    const seconds = String(timeLeft % 60).padStart(1, "0");

    return (
        <Alert severity="info">
            <AlertTitle>
                <Typography variant="body1" fontWeight={700}>
                    Reserva de asientos para el evento
                </Typography>
            </AlertTitle>
            <Typography variant="body2">
                Tienes <b>{minutes}m {seconds}s</b> para finalizar la compra antes de que los asientos se liberen.
            </Typography>
        </Alert>
    );
}