import { requestAxios } from "@/helpers/axiosHelper";
import { EventDetailDTO } from "@/models/event-detail.dto";
import { EventItemDTO } from "@/models/event-item.dto";
import { EventsFilters } from "@/models/filters/events-filters.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";

export async function getMainEvents(): Promise<PagedResponse<EventItemDTO>> {
    return requestAxios<null, PagedResponse<EventItemDTO>>(
        "GET",
        "events"
    );
}

export async function getEvents(filters: EventsFilters): Promise<PagedResponse<EventItemDTO>> {
    return requestAxios<EventsFilters, PagedResponse<EventItemDTO>>(
        "POST",
        "events",
        filters
    );
}

export async function getEventDetail(id: number): Promise<EventDetailDTO> {
    return requestAxios<null, EventDetailDTO>(
        "GET",
        `events\\${id}`,
    );
}