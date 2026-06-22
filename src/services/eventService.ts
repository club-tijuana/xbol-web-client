import { requestAxios } from "@/helpers/axiosHelper";
import { EventCategoryDTO } from "@/models/event-category.dto";
import { EventDetailDTO } from "@/models/event-detail.dto";
import { EventItemDTO } from "@/models/event-item.dto";
import { EventsFilters } from "@/models/filters/events-filters.dto";
import { FilteredEventsResponse } from "@/models/filters/filtered-events-response.dto";
import { SearchEventsFilters } from "@/models/filters/search-events-filters.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { PerformerDTO } from "@/models/performer.dto";
import { EventViewRequestDTO } from "@/models/requests/event-view-request.dto";
import { ScheduleItemDTO } from "@/models/schedule-item.dto";
import { SeoMetadataDTO } from "@/models/seo-metadata";

export async function getMainEvents(): Promise<PagedResponse<EventItemDTO>> {
  return requestAxios<null, PagedResponse<EventItemDTO>>(
    "GET",
    "events/main",
    null,
    undefined,
    { params: { includeMedia: true } },
  );
}

export async function getEvents(
  filters: EventsFilters,
): Promise<PagedResponse<EventItemDTO>> {
  const params = {
    page: filters.page,
    pageSize: filters.pageSize,
    eventCategoryId: filters.eventCategoryId,
    searchTerm: filters.searchTerm,
  };

  return requestAxios<EventsFilters, PagedResponse<EventItemDTO>>(
    "GET",
    "events",
    undefined,
    undefined,
    { params: { ...params, includeMedia: true } },
  );
}

export async function getFilteredEvents(
  filters: SearchEventsFilters,
): Promise<FilteredEventsResponse<PerformerDTO, ScheduleItemDTO>> {
  const params = {
    page: filters.page,
    pageSize: filters.pageSize,
    rangeDateFrom: filters.rangeDateFrom,
    rangeDateTo: filters.rangeDateTo,
    searchTerm: filters.searchTerm,
    performerId: filters.performerId,
    eventCategoryIds: filters.eventCategoryIds,
    trendingEvents: filters.trendingEvents,
  };

  return requestAxios<
    SearchEventsFilters,
    FilteredEventsResponse<PerformerDTO, ScheduleItemDTO>
  >("GET", "events/filtered-events", undefined, undefined, {
    params: { ...params, includeMedia: true },
  });
}

export async function getEventDetail(id: number): Promise<EventDetailDTO> {
  return requestAxios<null, EventDetailDTO>(
    "GET",
    `events\\${id}`,
    null,
    undefined,
    { params: { includeMedia: true } },
  );
}

export async function getEventCategories(): Promise<EventCategoryDTO[]> {
  return requestAxios<null, EventCategoryDTO[]>("GET", "events/categories");
}

export async function registerEventView(eventId: number, visitorId: string) {
  const viewRequest: EventViewRequestDTO = {
    eventId: eventId,
    platform: "web",
    visitorId: visitorId,
  };

  return requestAxios<EventViewRequestDTO, null>(
    "POST",
    "events/view",
    viewRequest,
  );
}

export async function getTrendingEvents(
  filters: EventsFilters,
): Promise<PagedResponse<EventItemDTO>> {
  return requestAxios<EventsFilters, PagedResponse<EventItemDTO>>(
    "GET",
    "events/trending-events",
    undefined,
    undefined,
    {
      params: {
        page: filters.page,
        pageSize: filters.pageSize,
        includeMedia: true,
      },
    },
  );
}

export async function getEventMetadataByScheduleIdAsync(id: number): Promise<SeoMetadataDTO> {
  return requestAxios<null, SeoMetadataDTO>(
    "GET",
    `events/${id}/metadata`
  );
}

export async function getUpcomingEvents(
  filters: EventsFilters,
): Promise<PagedResponse<EventItemDTO>> {
  const params = {
    page: filters.page,
    pageSize: filters.pageSize
  };

  return requestAxios<EventsFilters, PagedResponse<EventItemDTO>>(
    "GET",
    "events/upcoming-events",
    undefined,
    undefined,
    { params: { ...params, includeMedia: true } },
  );
}
