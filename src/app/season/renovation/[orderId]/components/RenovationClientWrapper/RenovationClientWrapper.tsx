"use client";

import { useEffect, useState } from "react";

import BookingClient from "@/app/booking/components/BookingClient/BookingClient";
import { SeasonToRenovateDTO } from "@/models/season-to-renovate.dto";
import { getOrderToRenovate } from "@/services/orderService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookMode, setSeasonRelatedOrderId, setSeats } from "@/store/slices/bookingSlice";

interface RenovationClientWrapperProps {
    orderId: number;
}

export default function RenovationClientWrapper({ orderId }: RenovationClientWrapperProps) {
    const dispatch = useAppDispatch();
    const selectedSeats = useAppSelector(store => store.booking.selectedSeats);
    const [seasonToRenovate, setSeasonToRenovate] = useState<SeasonToRenovateDTO | null>(null);

    useEffect(() => {
        async function loadSeason() {
            const season = await getOrderToRenovate(orderId);

            await dispatch(setBookMode("renovateSeason"))
            await dispatch(setSeasonRelatedOrderId(orderId));

            const prevSeats = season.previousSeats
                .flatMap(x =>
                    x.seats
                        .split(",")
                        .map(seat => [seat.trim(), 0] as [string, number])
                );
            await dispatch(setSeats(prevSeats));

            setSeasonToRenovate(season);
        };

        loadSeason();
    }, [orderId, dispatch]);

    return (
        <>
            {(seasonToRenovate && selectedSeats) &&
                <BookingClient id={seasonToRenovate.seasonId.toString()} bookingMode="renovateSeason" />
            }
        </>
    );
}