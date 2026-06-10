import { requestAxios } from "@/helpers/axiosHelper";
import { EventCatalogItemDTO } from "@/models/event-catalog-item.dto";
import { EventCatalogFilters } from "@/models/filters/event-catalog-filters.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { store } from "@/store";

export async function getEventCatalog(
  filters: EventCatalogFilters = {},
): Promise<PagedResponse<EventCatalogItemDTO>> {
  const state = store.getState();

  return requestAxios<EventCatalogFilters, PagedResponse<EventCatalogItemDTO>>(
    "GET",
    "event-catalog",
    undefined,
    state.auth.user?.token,
    { params: filters as Record<string, unknown> }
  );
}

export async function getEventCatalogItem(
  id: number,
  filters: Pick<EventCatalogFilters, "itemType"> = {},
): Promise<EventCatalogItemDTO> {
  const state = store.getState();

  return requestAxios<EventCatalogFilters, EventCatalogItemDTO>(
    "GET",
    `event-catalog/${id}`,
    undefined,
    state.auth.user?.token,
    { params: filters },
  );
}
