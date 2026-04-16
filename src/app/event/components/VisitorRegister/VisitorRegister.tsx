"use client";

import { useEffect } from "react";

import { registerEventView } from "@/services/eventService";
import { getVisitorId } from "@/utils/visitorId";


interface VisitorRegisterProps {
    eventId: number;
}

export default function VisitorRegister({ eventId }: VisitorRegisterProps) {
    useEffect(() => {
        const visitorId = getVisitorId();
        registerEventView(eventId, visitorId);
    }, [eventId]);

    return null;
}