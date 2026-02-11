import { requestAxios } from "@/helpers/axiosHelper";
import { TicketsFilters } from "@/models/filters/tickets-filters.dto";
import { MyEventDTO } from "@/models/my-event.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";

export async function getMyEvents(filters: TicketsFilters): Promise<PagedResponse<MyEventDTO> | null> {
    return requestAxios<TicketsFilters, PagedResponse<MyEventDTO>>(
        "POST",
        "clients/my-events",
        filters
    );
}