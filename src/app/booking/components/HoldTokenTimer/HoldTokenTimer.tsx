"use client";

import { Alert, AlertTitle, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { expireHoldToken } from "@/store/slices/bookingFlowSlice";

export default function HoldTokenTimer() {
    const dispatch = useAppDispatch();
    const holdTokenObj = useAppSelector(state => state.bookingFlow.holdTokenObj);
    const holdTokenStatus = useAppSelector(state => state.bookingFlow.holdTokenObj?.status);

    const [timeLeft, setTimeLeft] = useState(holdTokenObj?.expiresInSeconds ?? 0);
    const expiresAtRef = useRef<number | null>(null);
    const expiredDispatchedRef = useRef(false);

    useEffect(() => {
        if (!holdTokenObj || holdTokenStatus === "expired") return;

        expiresAtRef.current = Date.now() + holdTokenObj.expiresInSeconds * 1000;
        expiredDispatchedRef.current = false;

        const tick = () => {
            if (!expiresAtRef.current) return;
            const remaining = Math.max(0, Math.round((expiresAtRef.current - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0 && !expiredDispatchedRef.current) {
                expiredDispatchedRef.current = true;
                dispatch(expireHoldToken({ type: "auto" }));
            }
        };

        tick();

        const interval = setInterval(tick, 1000);

        // Recalculate immediately when tab becomes visible again after being throttled
        const handleVisibilityChange = () => {
            if (!document.hidden) tick();
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [holdTokenObj, holdTokenStatus]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(1, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

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