import { eventImageOrDefault } from "./event-image";
import { MediaSetDTO, mediaUrl } from "./media.dto";

export interface BundleItemDTO {
    id?: number;
    bannerImageUrl?: string;
    name?: string;
    startDate?: Date;
    location?: string;
    externalKey?: string;
    media?: MediaSetDTO | null;
    isRenewal: boolean;
    isPreSale: boolean;
    isGeneralSale: boolean;
}

export const getBundleBannerImageUrl = (bundle: BundleItemDTO): string =>
    eventImageOrDefault(mediaUrl(bundle.media?.banner) || bundle.bannerImageUrl);