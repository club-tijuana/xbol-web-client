import { formatDate } from "@/helpers/formatDateHelper";
import { BundleType } from "@/models/enums/bundle-type.enum";
import { EventCatalogItemType } from "@/models/enums/event-catalog-item-type.enum";
import { EventCategoryDTO } from "@/models/event-category.dto";
import { MediaSetDTO, mediaUrl } from "@/models/media.dto";
import { EventCardVM } from "@/models/views/event-card.vm";

export interface EventCatalogItemDTO {
  id: number;
  itemType: EventCatalogItemType;
  bundleType?: BundleType | null;
  status: string;
  scheduledStartDate: string;
  name: string;
  code?: string | null;
  categories: EventCategoryDTO[];
  venueMapId?: number | null;
  venueName?: string | null;
  externalEventKey?: string | null;
  availableSeats: number;
  totalSeats: number;
  media?: MediaSetDTO | null;
  posterImageUrl?: string | null;
  bannerImageUrl?: string | null;
  isSeason: boolean;
}

export function getEventCatalogPosterImageUrl(
  item: EventCatalogItemDTO,
): string | undefined {
  return mediaUrl(item.media?.logo)
    ?? mediaUrl(item.media?.banner)
    ?? item.posterImageUrl
    ?? item.bannerImageUrl
    ?? undefined;
}

export function getEventCatalogBannerImageUrl(
  item: EventCatalogItemDTO,
): string | undefined {
  return mediaUrl(item.media?.banner)
    ?? mediaUrl(item.media?.logo)
    ?? item.bannerImageUrl
    ?? item.posterImageUrl
    ?? undefined;
}

export function mapEventCatalogItemToCardVM(
  item: EventCatalogItemDTO,
): EventCardVM {
  return {
    eventId: item.id,
    detailHref: item.itemType === EventCatalogItemType.Bundle
      ? `/bundle/${item.id}`
      : `/event/${item.id}`,
    posterImageUrl: getEventCatalogPosterImageUrl(item) ?? "",
    name: item.name,
    startDate: formatDate(new Date(item.scheduledStartDate), "date"),
    location: item.venueName ?? "",
    categories: item.categories,
    isFavorite: false,
  };
}
