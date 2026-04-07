"use client";

import { useEffect, useState } from "react";

import BookingClient from "@/app/booking/components/BookingClient/BookingClient";
import { SeasonToRenovateDTO } from "@/models/season-to-renovate.dto";
import { getOrderToRenovate } from "@/services/orderService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookMode, setInitialSeats, setOrderLeftSeats, setRenovationType, setSeasonRelatedOrderId } from "@/store/slices/bookingFlowSlice";

interface RenovationClientWrapperProps {
    orderId: number;
}

export default function RenovationClientWrapper({ orderId }: RenovationClientWrapperProps) {
    const dispatch = useAppDispatch();
    const initialSeats = useAppSelector(store => store.bookingFlow.initialSeats);
    const [seasonToRenovate, setSeasonToRenovate] = useState<SeasonToRenovateDTO | null>(null);

    useEffect(() => {
        async function loadSeason() {
            const season = await getOrderToRenovate(orderId);

            await dispatch(setBookMode("renovateSeason"));
            await dispatch(setRenovationType("sameSeats"));
            await dispatch(setSeasonRelatedOrderId(orderId));

            if (season.previousSeatPrices) {
                const prevSeats = season.previousSeatPrices
                    .map(seat =>
                        [seat.externalSeatObjectKey, seat.priceOverride] as [string, number]
                    );

                await dispatch(setInitialSeats(prevSeats));
                await dispatch(setOrderLeftSeats(prevSeats.length));
            }

            setSeasonToRenovate(season);
        };

        loadSeason();
    }, [orderId, dispatch]);

    return (
        <>
            {(seasonToRenovate && initialSeats) &&
                <BookingClient id={seasonToRenovate.seasonId.toString()} bookingMode="renovateSeason" />
            }
        </>
    );
}