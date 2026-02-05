import { EventDetailDTO } from "@/models/event-detail.dto";
import { EventItemDTO } from "@/models/event-item.dto";
import { EventsFilters } from "@/models/filters/events-filters.dto";
import { PagedResponse } from "@/models/pagination/paged-response.dto";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMainEvents(): Promise<PagedResponse<EventItemDTO>> {
    const response = await fetch(`${BASE_URL}events`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Get main events error");
    }

    return response.json();
}

export async function getEvents(filters: EventsFilters): Promise<PagedResponse<EventItemDTO>> {
    const response = await fetch(`${BASE_URL}events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filters)
    });

    if (!response.ok) {
        throw new Error("Get events error");
    }

    return response.json();
}

export async function getEventDetail(id: number): Promise<EventDetailDTO> {
    const response = await fetch(`${BASE_URL}events\\${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Get event error");
    }

    return response.json();
}