"use client";

import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BookingClient from "@/app/booking/components/BookingClient/BookingClient";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { SeasonToRenovateDTO } from "@/models/season-to-renovate.dto";
import { getOrderToRenovate } from "@/services/orderService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookHoldToken, setBookMode, setInitialSeats, setOrderLeftSeats, setRenovationType, setSeasonRelatedOrderId } from "@/store/slices/bookingFlowSlice";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";

interface RenovationClientWrapperProps {
    orderId: number;
}

export default function RenovationClientWrapper({ orderId }: RenovationClientWrapperProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const initialSeats = useAppSelector(store => store.bookingFlow.initialSeats);
    const generalMessage = useAppSelector(state => state.ui.generalMessage);
    const [seasonToRenovate, setSeasonToRenovate] = useState<SeasonToRenovateDTO | null>(null);

    useEffect(() => {
        async function loadSeason() {
            try {
                const season = await getOrderToRenovate(orderId);

                await dispatch(setBookMode("renovateSeason"));
                await dispatch(setRenovationType("sameSeats"));
                await dispatch(setSeasonRelatedOrderId(orderId));
                await dispatch(setBookHoldToken({
                    expiresAt: "",
                    expiresInSeconds: 0,
                    token: ""
                }));

                if (season.previousSeatPrices) {
                    const prevSeats = season.previousSeatPrices
                        .map(seat =>
                            [seat.externalSeatObjectKey, seat.priceOverride] as [string, number]
                        );

                    await dispatch(setInitialSeats(prevSeats));
                    await dispatch(setOrderLeftSeats(prevSeats.length));
                }

                setSeasonToRenovate(season);
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));

                router.push("/");
            }
        };

        loadSeason();
    }, [orderId, dispatch, router]);

    return (
        <>
            {(seasonToRenovate && initialSeats) &&
                <BookingClient id={seasonToRenovate.seasonId.toString()} bookingMode="renovateSeason" />
            }

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={!!generalMessage.message}
                autoHideDuration={4000}
                onClose={() => dispatch(clearGeneralMessage())}>
                <Alert
                    severity={generalMessage.severity}
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {generalMessage.message}
                </Alert>
            </Snackbar>
        </>
    );
}