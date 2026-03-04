import { requestAxios } from "@/helpers/axiosHelper";
import { EventCategoryDTO } from "@/models/event-category.dto";
import { EventDetailDTO } from "@/models/event-detail.dto";
import { EventItemDTO } from "@/models/event-item.dto";
import { EventsFilters } from "@/models/filters/events-filters.dto";
import { FilteredEventsResponse } from "@/models/filters/filtered-events-response.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { PerformerDTO } from "@/models/performer.dto";

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

export async function getFilteredEvents(filters: EventsFilters): Promise<FilteredEventsResponse<PerformerDTO, EventItemDTO>> {
    return requestAxios<EventsFilters, FilteredEventsResponse<PerformerDTO, EventItemDTO>>(
        "POST",
        "events/filtered-events",
        filters
    );
}

export async function getEventDetail(id: number): Promise<EventDetailDTO> {
    return requestAxios<null, EventDetailDTO>(
        "GET",
        `events\\${id}`,
    );
}

export async function getEventCategories(): Promise<EventCategoryDTO[]> {
    return requestAxios<null, EventCategoryDTO[]>(
        'GET',
        "events/categories"
    );
}