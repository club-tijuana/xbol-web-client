"use client";

import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BookingSeasonClient from "@/app/booking/components/BookingSeasonClient/BookingSeasonClient";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { BundleToRenovateDTO } from "@/models/bundle-to-renovate.dto";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { getOrderToRenovate } from "@/services/orderService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetState as resetStateFlow, setBookHoldToken, setBookMode, setInitialSeats, setOrderLeftSeats, setOriginalSeats, setRenovationType, setSeasonRelatedOrderId, setSeats } from "@/store/slices/bookingFlowSlice";
import { resetState } from "@/store/slices/bookingSlice";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";

interface RenovationClientWrapperProps {
    orderId: number;
}

export default function RenovationClientWrapper({ orderId }: RenovationClientWrapperProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.auth.user?.token);
    const initialSeats = useAppSelector(store => store.bookingFlow.initialSeats);
    const generalMessage = useAppSelector(state => state.ui.generalMessage);
    const [bundleToRenovate, setBundleToRenovate] = useState<BundleToRenovateDTO | null>(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const source = params.get("source");
        const isFromEvo = source === "evo";

        async function loadSeason() {
            try {
                await dispatch(resetState());
                await dispatch(resetStateFlow());

                const bundle = await getOrderToRenovate(orderId);

                await dispatch(setBookMode("renovateSeason"));
                await dispatch(setRenovationType("sameSeats"));
                await dispatch(setSeasonRelatedOrderId(orderId));
                await dispatch(setBookHoldToken({
                    expiresAt: "",
                    expiresInSeconds: 0,
                    token: ""
                }));

                if (bundle.previousSeatPrices) {
                    const prevSeats: BookingSeatRequest[] = bundle.previousSeatPrices.map(
                        seat => ({
                            seatKey: seat.externalSeatObjectKey,
                            seatPrice: seat.priceOverride ?? 0,
                            priceListItemId: seat.priceListItemId ?? 0
                        })
                    );

                    await dispatch(setInitialSeats(prevSeats));
                    await dispatch(setSeats(prevSeats));
                    await dispatch(setOriginalSeats(prevSeats));
                    await dispatch(setOrderLeftSeats(prevSeats.length));
                }

                setBundleToRenovate(bundle);
            }
            catch (error) {
                if (isFromEvo) {
                    setBundleToRenovate({ relatedOrderId: 0, bundleId: 0 } as BundleToRenovateDTO);
                    await dispatch(setInitialSeats([]));
                    return;
                }

                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));

                router.push("/");
            }
        };

        loadSeason();
    }, [orderId, dispatch, router, token]);

    return (
        <>
            {(bundleToRenovate && initialSeats) &&
                <BookingSeasonClient id={bundleToRenovate.bundleId.toString()} isRenovation={true} />
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