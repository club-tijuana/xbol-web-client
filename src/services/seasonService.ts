import { requestAxios } from "@/helpers/axiosHelper";
import { SeasonItemDTO } from "@/models/season-item.dto";

const PATH: string = "seasons";

export async function getSeasonBanner(): Promise<SeasonItemDTO | undefined> {
    return requestAxios<null, SeasonItemDTO | undefined>(
        "GET",
        `${PATH}`
    );
}