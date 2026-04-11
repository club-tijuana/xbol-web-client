"use client";

import { useEffect, useState } from "react";

import { OrderType } from "@/models/enums/order-type.enum";
import { MyEventDTO } from "@/models/my-event.dto";
import { getMyEvents } from "@/services/accountService";

import TicketTabs from "../TicketTabs/TicketTabs";

export default function TicketsClientWrapper() {
    const [myEvents, setMyEvents] = useState<MyEventDTO[]>([]);
    const [mySeasons, setMySeasons] = useState<MyEventDTO[]>([]);

    useEffect(() => {
        async function load() {
            const events = await getMyEvents({ page: 1, pageSize: 10, orderType: OrderType.Ticket });
            const seasons = await getMyEvents({ page: 1, pageSize: 10, orderType: OrderType.SeasonPass });

            setMyEvents(events?.items ?? []);
            setMySeasons(seasons?.items ?? []);
        }

        load();
    }, []);

    return (
        <TicketTabs myEvents={myEvents} mySeasons={mySeasons} />
    );
}