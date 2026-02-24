import { EventCategory } from "@/models/enums/event-category.enum";

export const EventCategoryLabel: Record<EventCategory, string> = {
    [EventCategory.Sports]: "Deporte",
    [EventCategory.Concert]: "Música",
    [EventCategory.Theater]: "Teatro"
};