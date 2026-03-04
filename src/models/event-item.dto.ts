import { EventCategoryDTO } from "./event-category.dto";

export interface EventItemDTO {
    id: number;
    bannerImageUrl: string;
    posterImageUrl: string;
    name: string;
    startDate: Date;
    location: string;
    eventKey?: string;
    categories: EventCategoryDTO[];
}