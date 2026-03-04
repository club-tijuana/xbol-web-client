import { EventCategoryDTO } from "./event-category.dto";
import { EventScheduleDTO } from "./event-schedule.dto";

export interface EventDetailDTO {
    id: number;
    name: string;
    shortDescription?: string;
    longDescription?: string;
    gallery: string[];
    schedules: EventScheduleDTO[];
    categories: EventCategoryDTO[];
}