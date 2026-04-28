export enum EventCategory {
    Sports,
    Concert,
    Theater
}

export const EventCategoryLabels: Record<EventCategory, string> = {
    [EventCategory.Sports]: "Deportes",
    [EventCategory.Concert]: "Conciertos",
    [EventCategory.Theater]: "Teatro"
};