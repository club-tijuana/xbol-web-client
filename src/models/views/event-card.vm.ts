import { EventCategoryDTO } from "../event-category.dto";

export interface EventCardVM {
    eventId: number;
    scheduleId?: number;
    posterImageUrl: string;
    name: string;
    startDate: string;
    location: string;
    categories: EventCategoryDTO[];
}