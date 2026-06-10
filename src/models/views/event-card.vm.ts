import { EventCategoryDTO } from "../event-category.dto";

export interface EventCardVM {
  eventId: number;
  scheduleId?: number;
  detailHref?: string;
  posterImageUrl: string;
  name: string;
  startDate: string;
  location: string;
  categories: EventCategoryDTO[];
  isFavorite: boolean;
}
