import { requestAxios } from "@/helpers/axiosHelper";
import { EventItemDTO } from "@/models/event-item.dto";
import { ReservationFilters } from "@/models/filters/reservation-filters.dto";
import { SectionDTO } from "@/models/section.dto";
import { ZoneDTO } from "@/models/zone.dto";

export async function getZonesBySchedule(scheduleId: number): Promise<ZoneDTO[]> {
    return requestAxios<null, ZoneDTO[]>(
        "GET",
        `bookings/zones-by-schedule/${scheduleId}`
    );
}

export async function getEventItemBySchedule(scheduleId: number): Promise<EventItemDTO> {
    return requestAxios<null, EventItemDTO>(
        "GET",
        `bookings/event-by-schedule/${scheduleId}`
    );
}

export async function getSeatsAvailability(filters: ReservationFilters): Promise<SectionDTO> {
    return requestAxios<ReservationFilters, SectionDTO>(
        "POST",
        "bookings/seats-availability",
        filters
    );
}