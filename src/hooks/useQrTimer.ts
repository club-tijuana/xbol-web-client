"use client";

import { generate } from "otplib";
import { useEffect, useRef, useState } from "react";

interface UseQrTimerProps {
    isActive: boolean;
    ticketId: string;
    secretBase32: string;
    stepSeconds: number;
    onGenerate: (payload: string) => void;
}

export function useQrTimer({
    isActive,
    ticketId,
    secretBase32,
    stepSeconds,
    onGenerate,
}: UseQrTimerProps) {
    const [secondsRemaining, setSecondsRemaining] = useState(stepSeconds);
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
            return;
        }

        const tick = async () => {
            const epochSeconds = Math.floor(Date.now() / 1000);
            const remaining = stepSeconds - (epochSeconds % stepSeconds);

            setSecondsRemaining(remaining === stepSeconds ? 0 : remaining);

            const percent =
                ((stepSeconds - remaining) / stepSeconds) * 100;
            setProgressPercent(percent);

            const window = Math.floor(epochSeconds / stepSeconds);

            if (window !== lastWindowRef.current) {
                lastWindowRef.current = window;

                const otp = await generate({
                    secret: secretBase32,
                    period: stepSeconds,
                    digits: 6,
                    algorithm: "sha1",
                    epoch: epochSeconds,
                    strategy: "totp",
                });

                onGenerate(`${ticketId}|${otp}`);
            }
        };

        tick();
        intervalRef.current = setInterval(tick, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, ticketId, secretBase32, stepSeconds, onGenerate]);

    return { secondsRemaining, progressPercent };
}
