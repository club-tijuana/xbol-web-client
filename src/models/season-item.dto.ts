import { MediaSetDTO, mediaUrl } from "./media.dto";

export interface SeasonItemDTO {
    id: number;
    bannerImageUrl: string;
    startDate: Date;
    externalSeasonKey: string;
    media?: MediaSetDTO | null;
}

export const getSeasonBannerImageUrl = (season: SeasonItemDTO): string =>
    mediaUrl(season.media?.banner) ?? season.bannerImageUrl;
