import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";

import TicketPageClient from "./components/TicketPageClient/TicketPageClient";

//const getMyEventDetailCached = cache(getMyEventDetail);

/* export async function generateMetadata(
    { params }: { params: Promise<{ orderId: string; eventId: string; }> }
): Promise<Metadata> {
    const { orderId } = (await params);

    if (!orderId) {
        return {
            title: "Detalle de ticket | PWRTicket",
            description: "Consulta los detalles de tu evento y tus boletos.",
            robots: "noindex, follow",
        };
    }

    const detail = await getMyEventDetailCached(Number.parseInt(orderId));

    const description = detail
        ? `Tus tickets para "${detail.name}" el ${detail.date ? new Date(detail.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} en ${detail.location}. Consulta tus asientos, folio y más detalles del evento.`
        : "Detalles de tus tickets de evento.";

    return buildSeoMetadata({
        title: `${detail?.name || 'Evento'} | Mis Tickets`,
        description,
        url: `https://dev.com/mis-tickets/${orderId}`,
        image: detail?.eventImage ?? "/og-default.jpg",
        type: "article",
    });
} */

interface TicketPageProps {
    params: Promise<{
        orderId: string;
        eventId: string;
    }>;
}

export default async function TicketPage(props: TicketPageProps) {
    const { orderId, eventId } = await props.params;

    const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
    const trendingEventsVM = trendingEvents.items.map(mapEventToCardVM);

    return (
        <TicketPageClient
            eventId={Number(eventId)}
            orderId={Number(orderId)}
            trendingEvents={trendingEventsVM}
        />
    );
}