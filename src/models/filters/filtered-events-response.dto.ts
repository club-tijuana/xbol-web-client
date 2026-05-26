import { PagedResponse } from "../pagination/paged-response.dto";

export interface FilteredEventsResponse<P, E> {
    performers: P[];
    pagedEvents: PagedResponse<E>;
}