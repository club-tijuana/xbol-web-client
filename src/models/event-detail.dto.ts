import { EventCategoryDTO } from "./event-category.dto";
import { EventScheduleDTO } from "./event-schedule.dto";

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
    gallery: string[];
    schedules: EventScheduleDTO[];
    categories: EventCategoryDTO[];
}