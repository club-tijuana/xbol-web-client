import { EventCategory } from "./enums/event-category.enum";

export interface EventItemDTO {
    id: number;
    bannerImageUrl: string;
    posterImageUrl: string;
    name: string;
    startDate: Date;
    location: string;
    category: EventCategory;
    eventKey?: string;
}