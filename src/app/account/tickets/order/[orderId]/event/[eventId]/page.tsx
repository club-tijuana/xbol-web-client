import { Metadata } from "next";

import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";
import { getOrderMetadata } from "@/services/orderService";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import TicketPageClient from "./components/TicketPageClient/TicketPageClient";

interface TicketPageProps {
    params: Promise<{
        orderId: string;
        eventId: string;
    }>;
}

export async function generateMetadata(
    { params }: TicketPageProps
): Promise<Metadata> {
    const { orderId } = await params;
    const orderIdNumber = Number(orderId);

    const orderMetadata = await getOrderMetadata(orderIdNumber);

    return buildSeoMetadata({
        title: orderMetadata.title,
        description: orderMetadata.description ?? "",
        url: "",
        image: orderMetadata.imageUrl,
        type: "website"
    });
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