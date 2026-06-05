import { MediaSetDTO, mediaUrl } from "./media.dto";

export interface SeasonItemDTO {
    id: number;
    bannerImageUrl: string;
    startDate: Date;
    externalSeasonKey: string;
    media?: MediaSetDTO | null;
    isRenewal: boolean;
    isPreSale: boolean;
    isGeneralSale: boolean;
}

export const getSeasonBannerImageUrl = (season: SeasonItemDTO): string =>
    mediaUrl(season.media?.banner) ?? season.bannerImageUrl;
