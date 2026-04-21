import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";

import TicketPageClient from "./components/TicketPageClient/TicketPageClient";

interface TicketPageProps {
    params: Promise<{
        orderId: string;
        eventId: string;
    }>;
}

export default async function TicketPage(props: TicketPageProps) {
    const { orderId, eventId } = await props.params;

    const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
    const trendingEventsVM = trendingEvents.items.map(e =>
        mapEventToCardVM(e)
    );

    return (
        <TicketPageClient
            eventId={Number(eventId)}
            orderId={Number(orderId)}
            trendingEvents={trendingEventsVM}
        />
    );
}

export const dynamic = 'force-dynamic';