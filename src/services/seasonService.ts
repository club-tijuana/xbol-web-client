import { requestAxios } from "@/helpers/axiosHelper";
import { SeasonItemDTO } from "@/models/season-item.dto";
import { store } from "@/store";

const PATH: string = "seasons";

export async function getSeasonBanner(): Promise<SeasonItemDTO | undefined> {
    const state = store.getState();

    return requestAxios<null, SeasonItemDTO | undefined>(
        "GET",
        `${PATH}`,
        undefined,
        state.auth.user?.token,
        { params: { includeMedia: true } }
    );
}
