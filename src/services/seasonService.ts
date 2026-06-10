import { requestAxios } from "@/helpers/axiosHelper";
import { SeasonItemDTO } from "@/models/season-item.dto";
import { SeoMetadataDTO } from "@/models/seo-metadata";
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

export async function getSeasonMetadataAsync(seasonId: number): Promise<SeoMetadataDTO> {
    return requestAxios<null, SeoMetadataDTO>(
        "GET",
        `${PATH}/${seasonId}/metadata`
    );
}