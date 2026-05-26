import { requestAxios } from "@/helpers/axiosHelper";
import { TicketsFilters } from "@/models/filters/tickets-filters.dto";
import { MyEventDetailDTO } from "@/models/my-event-detail.dto";
import { MyEventDTO } from "@/models/my-event.dto";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { store } from "@/store";

export async function getMyEvents(
    filters: TicketsFilters
): Promise<PagedResponse<MyEventDTO> | null> {
    const state = store.getState();
    const token = state.auth.user?.token;

    if (!token) {
        return null;
    }

    const params = {
        page: filters.page,
        pageSize: filters.pageSize,
        orderType: filters.orderType
    };

    const response = await requestAxios<TicketsFilters, PagedResponse<MyEventDTO>>(
        "GET",
        "clients/my-events",
        undefined,
        token,
        { params }
    );

    if (!response) return null;

    return {
        ...response,
        items: response.items
    };
}


export async function getMyEventDetail(eventId: number, orderId: number): Promise<MyEventDetailDTO | null> {
    const state = store.getState();
    const token = state.auth.user?.token;

    if (!token) {
        return null;
    }

    return await requestAxios<null, MyEventDetailDTO>(
        "GET",
        `clients/my-event/${eventId}/${orderId}`,
        null,
        token
    );
}

export async function getMyEventTickets(filters: TicketsFilters): Promise<PagedResponse<MyTicketDto> | null> {
    const state = store.getState();
    const token = state.auth.user?.token;

    if (!token) {
        return null;
    }

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
        token,
        { params }
    );
}
