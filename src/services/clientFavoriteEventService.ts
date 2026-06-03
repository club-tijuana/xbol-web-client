import { requestAxios } from "@/helpers/axiosHelper";
import { EventItemDTO } from "@/models/event-item.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";
import { ToggleFavoriteResponse } from "@/models/toggle-favorite-response.dto";
import { store } from "@/store";

const PATH = "favorites";

export async function toggleFavorite(
  eventId: number,
): Promise<ToggleFavoriteResponse> {
  const state = store.getState();

  return requestAxios<null, ToggleFavoriteResponse>(
    "POST",
    `${PATH}/${eventId}/toggle`,
    null,
    state.auth.user?.token,
  );
}


export async function getClientFavorites(
  page: number,
  pageSize: number
): Promise<PagedResponse<EventItemDTO>> {
  const state = store.getState();

  const params = {
    page: page,
    pageSize: pageSize,
    includeMedia: true
  };

  return requestAxios<null, PagedResponse<EventItemDTO>>(
    "GET",
    `${PATH}/get-list-by-clientid`,
    undefined,
    state.auth.user?.token,
    { params },
  );
}

export async function getFavoritesIdsByClientId(): Promise<number[]> {
  const state = store.getState();

  return requestAxios<null, number[]>(
    "GET",
    `${PATH}/get-client-favorites-ids`,
    undefined,
    state.auth.user?.token
  );
}
