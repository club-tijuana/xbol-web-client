import { formatDate } from "@/helpers/formatDateHelper";
import { DateFormatMode } from "@/types/dateFormatMode";

import { EventCategoryDTO } from "./event-category.dto";
import { eventImageOrDefault } from "./event-image";
import { EventMediaSetDTO, mediaUrl } from "./media.dto";
import { EventCardVM } from "./views/event-card.vm";

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
  isFromSeasonPass: boolean;
}

export const getEventBannerImageUrl = (event: EventItemDTO): string =>
  eventImageOrDefault(mediaUrl(event.media?.banner) || event.bannerImageUrl);

export const getEventPosterImageUrl = (event: EventItemDTO): string =>
  eventImageOrDefault(mediaUrl(event.media?.banner) || event.posterImageUrl);

export const mapEventToCardVM = (
  e: EventItemDTO,
  dateMode?: DateFormatMode,
): EventCardVM => ({
  eventId: e.id,
  posterImageUrl: getEventPosterImageUrl(e),
  name: e.name,
  startDate: formatDate(e.startDate, dateMode ?? "date"),
  location: e.location,
  categories: e.categories,
  isFavorite: e.isFavorite,
});
