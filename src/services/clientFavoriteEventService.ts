import { requestAxios } from "@/helpers/axiosHelper";
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
