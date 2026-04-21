import { EventCardVM } from "@/models/views/event-card.vm";

export interface TicketPageClientProps {
    orderId: number;
    eventId: number;
    trendingEvents: EventCardVM[];
}