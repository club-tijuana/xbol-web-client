"use client";

import { generate } from "otplib";
import { useEffect, useRef, useState } from "react";

/* -------------------- CONSTANTS -------------------- */
const SECRET_BASE_32 = process.env.NEXT_PUBLIC_SECRET_BASE_32;
const STEP_SECONDS = 30;
const MILLISECONDS_IN_SECOND = 1000;
const PERCENTAGE_MAX = 100;
const OTP_DIGITS = 6;

const OTP_CONFIG = {
    algorithm: "sha1",
    strategy: "totp",
} as const;

/* -------------------- TYPES -------------------- */
interface UseQrTimerProps {
    isActive: boolean;
    ticketId: string;
    onGenerate: (payload: string) => void;
}

/* -------------------- HOOK -------------------- */
export function useQrTimer({
    isActive,
    ticketId,
    onGenerate,
}: UseQrTimerProps) {
    const [secondsRemaining, setSecondsRemaining] = useState(STEP_SECONDS);
    const [progressPercent, setProgressPercent] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastWindowRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isActive) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            lastWindowRef.current = null;
            onGenerate("");
            return;
        }

        const tick = async () => {
            const epochSeconds = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
            const remaining = STEP_SECONDS - (epochSeconds % STEP_SECONDS);

            setSecondsRemaining(remaining === STEP_SECONDS ? 0 : remaining);

            const percent =
                ((STEP_SECONDS - remaining) / STEP_SECONDS) * PERCENTAGE_MAX;
            setProgressPercent(percent);

            const window = Math.floor(epochSeconds / STEP_SECONDS);

            if (window !== lastWindowRef.current) {
                lastWindowRef.current = window;

                const otp = await generate({
                    secret: SECRET_BASE_32,
                    period: STEP_SECONDS,
                    digits: OTP_DIGITS,
                    algorithm: OTP_CONFIG.algorithm,
                    epoch: epochSeconds,
                    strategy: OTP_CONFIG.strategy,
                });

                onGenerate(`${ticketId}|${otp}`);
            }
        };

        tick();
        intervalRef.current = setInterval(tick, MILLISECONDS_IN_SECOND);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, ticketId, onGenerate]);

    return { secondsRemaining, progressPercent };
}
