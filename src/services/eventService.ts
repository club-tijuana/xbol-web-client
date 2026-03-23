import { requestAxios } from "@/helpers/axiosHelper";
import { EventCategory } from "@/models/enums/event-category.enum";
import { EventDetailDTO } from "@/models/event-detail.dto";
import { EventItemDTO } from "@/models/event-item.dto";
import { EventsFilters } from "@/models/filters/events-filters.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";

export async function getMainEvents(): Promise<PagedResponse<EventItemDTO>> {
    return getEvents({ page: 1, pageSize: 10, eventCategory: null });
}

export async function getEvents(filters: EventsFilters): Promise<PagedResponse<EventItemDTO>> {
    const params = new URLSearchParams();
    params.set("page", String(filters.page));
    params.set("pageSize", String(filters.pageSize));
    params.set("sortBy", filters.sortBy ?? "dateTime");

    const descending =
        filters.sortDesc === "true" ||
        filters.sortDesc === "desc" ||
        filters.sortDesc === "1";
    params.set("descending", String(descending));

    if (filters.textFilter?.trim()) {
        params.set("search", filters.textFilter.trim());
    }

    if (filters.eventCategory !== null && filters.eventCategory !== undefined) {
        const categoryName = EventCategory[filters.eventCategory] as string | undefined;
        if (categoryName) {
            params.set("categories", categoryName);
        }
    }

    const qs = params.toString();
    return requestAxios<undefined, PagedResponse<EventItemDTO>>(
        "GET",
        `events?${qs}`
    );
}

/** GET api/events/{eventId} */
export async function getEventDetail(id: number): Promise<EventDetailDTO> {
    return requestAxios<null, EventDetailDTO>("GET", `events/${id}`);
}