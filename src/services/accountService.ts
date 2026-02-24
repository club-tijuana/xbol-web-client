import { requestAxios } from "@/helpers/axiosHelper";
import { TicketsFilters } from "@/models/filters/tickets-filters.dto";
import { MyEventDetailDTO } from "@/models/my-event-detail.dto";
import { MyEventDTO } from "@/models/my-event.dto";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";

export async function getMyEvents(
    filters: TicketsFilters
): Promise<PagedResponse<MyEventDTO> | null> {
    const response = await requestAxios<TicketsFilters, PagedResponse<MyEventDTO>>(
        "POST",
        "clients/my-events",
        filters
    );

    if (!response) return null;

    const duplicatedItems = response.items.flatMap((item) =>
        Array.from({ length: 8 }).map(() => ({
            ...item,
            _uiKey: `${item.eventId}-${crypto.randomUUID()}`
        }))
    );

    return {
        ...response,
        items: duplicatedItems
    };
}


export async function getMyEventDetail(eventId: number): Promise<MyEventDetailDTO | null> {
    return await requestAxios<null, MyEventDetailDTO>(
        "GET",
        `clients/my-event/${eventId}`
    );
}

export async function getMyEventTickets(filters: TicketsFilters): Promise<PagedResponse<MyTicketDto> | null> {
    return await requestAxios<TicketsFilters, PagedResponse<MyTicketDto>>(
        "POST",
        "clients/my-event-tickets",
        filters
    );
}