import { requestAxios } from "@/helpers/axiosHelper";
import { TicketsFilters } from "@/models/filters/tickets-filters.dto";
import { MyEventDetailDTO } from "@/models/my-event-detail.dto";
import { MyEventDTO } from "@/models/my-event.dto";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";

const TOKEN = "";

export async function getMyEvents(
    filters: TicketsFilters
): Promise<PagedResponse<MyEventDTO> | null> {
    const params = {
        page: filters.page,
        pageSize: filters.pageSize,
        orderType: filters.orderType
    };

    const response = await requestAxios<TicketsFilters, PagedResponse<MyEventDTO>>(
        "GET",
        "clients/my-events",
        undefined,
        TOKEN,
        { params }
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
    const params = {
        page: filters.page,
        pageSize: filters.pageSize,
        eventId: filters.eventId,
        orderId: filters.orderId
    };

    return await requestAxios<TicketsFilters, PagedResponse<MyTicketDto>>(
        "GET",
        "clients/my-event-tickets",
        undefined,
        TOKEN,
        { params }
    );
}