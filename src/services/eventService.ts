import events from "@/data/events.mock.json";
import { EventCardDto } from "@/models/event-card.dto";

export function getOutstandingEvents(limit: number = 6): EventCardDto[] {
    return events.slice(0, limit);
}

export function getEventsByCategory(category: number, limit: number): EventCardDto[] {
    const filtered = events.filter(e => e.category === category);

    if (category === 1) {
        return filtered.slice(6, 6 + limit);
    }

    return filtered.slice(0, limit);
}