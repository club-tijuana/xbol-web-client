import { formatDate } from "@/helpers/formatDateHelper";

import { EventCategoryDTO } from "./event-category.dto";
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
}

export const mapEventToCardVM = (e: EventItemDTO): EventCardVM => ({
    eventId: e.id,
    posterImageUrl: e.posterImageUrl,
    name: e.name,
    startDate: formatDate(e.startDate, "date"),
    location: e.location,
    categories: e.categories
});