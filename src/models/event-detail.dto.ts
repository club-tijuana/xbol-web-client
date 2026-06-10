import { AgeRestriction } from "./enums/age-restriction.enum";
import { EventCategoryDTO } from "./event-category.dto";
import { eventImageOrDefault } from "./event-image";
import { EventScheduleDTO } from "./event-schedule.dto";
import { EventMediaSetDTO, mediaUrl } from "./media.dto";

export interface EventDetailDTO {
  id: number;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  image: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  ageRestriction?: AgeRestriction;
  securityPolicies?: string;
  gallery: string[];
  schedules: EventScheduleDTO[];
  categories: EventCategoryDTO[];
  isFavorite: boolean;
  media?: EventMediaSetDTO | null;
}

export const getEventDetailImageUrl = (event: EventDetailDTO): string =>
  eventImageOrDefault(mediaUrl(event.media?.banner) || event.image);

export const getEventDetailGalleryUrls = (event: EventDetailDTO): string[] => {
  const mediaGallery = event.media?.gallery
    ?.map(item => mediaUrl(item))
    .filter((url): url is string => Boolean(url));

  return mediaGallery && mediaGallery.length > 0
    ? mediaGallery
    : event.gallery;
};

export const getEventDetailSponsorUrls = (event: EventDetailDTO): string[] =>
  event.media?.sponsors
    ?.map(item => mediaUrl(item))
    .filter((url): url is string => Boolean(url)) ?? [];
