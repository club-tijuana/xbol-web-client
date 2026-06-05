import { formatDate } from "@/helpers/formatDateHelper";
import { DateFormatMode } from "@/types/dateFormatMode";

import { EventCategoryDTO } from "./event-category.dto";
import { EventMediaSetDTO, mediaUrl } from "./media.dto";
import { EventCardVM } from "./views/event-card.vm";

const FALLBACK_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE ?? "";

export interface EventItemDTO {
    id: number;
    bannerImageUrl: string;
    posterImageUrl: string;
    name: string;
    startDate: Date;
    location: string;
    eventKey?: string;
    categories: EventCategoryDTO[];
    isFavorite: boolean;
    media?: EventMediaSetDTO | null;
}

export const getEventBannerImageUrl = (event: EventItemDTO): string =>
    mediaUrl(event.media?.banner) ||
    event.bannerImageUrl?.trim() ||
    FALLBACK_IMAGE;

export const getEventPosterImageUrl = (event: EventItemDTO): string =>
    mediaUrl(event.media?.banner) ||
    event.posterImageUrl?.trim() ||
    FALLBACK_IMAGE;

export const mapEventToCardVM = (e: EventItemDTO, dateMode?: DateFormatMode): EventCardVM => ({
    eventId: e.id,
    posterImageUrl: getEventPosterImageUrl(e),
    name: e.name,
    startDate: formatDate(e.startDate, dateMode ?? "date"),
    location: e.location,
    categories: e.categories,
    isFavorite: e.isFavorite
});
