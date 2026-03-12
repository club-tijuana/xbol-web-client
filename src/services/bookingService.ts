import { requestAxios } from "@/helpers/axiosHelper";
import { BookingResult } from "@/models/booking-result.dto";
import { EventItemDTO } from "@/models/event-item.dto";
import { ReservationFilters } from "@/models/filters/reservation-filters.dto";
import { EventBookingRequest } from "@/models/requests/event-booking-request.dto";
import { SeasonBookingRequest } from "@/models/requests/season-booking-request.dto";
import { SectionDTO } from "@/models/section.dto";
import { ZoneDTO } from "@/models/zone.dto";

const PATH: string = "bookings";

export async function getZonesBySchedule(scheduleId: number): Promise<ZoneDTO[]> {
    return requestAxios<null, ZoneDTO[]>(
        "GET",
        `${PATH}/zones-by-schedule/${scheduleId}`
    );
}

export async function getEventItemBySchedule(scheduleId: number): Promise<EventItemDTO> {
    return requestAxios<null, EventItemDTO>(
        "GET",
        `${PATH}/event-by-schedule/${scheduleId}`
    );
}

export async function getSeatsAvailability(filters: ReservationFilters): Promise<SectionDTO[]> {
    return requestAxios<ReservationFilters, SectionDTO[]>(
        "POST",
        `${PATH}/seats-availability`,
        filters
    );
}

export async function eventBookSeats(request: EventBookingRequest): Promise<BookingResult> {
    return requestAxios<EventBookingRequest, BookingResult>(
        "POST",
        `${PATH}/event/book-seats`,
        request
    );
}

export async function seasonBookSeats(request: SeasonBookingRequest): Promise<BookingResult> {
    return requestAxios<SeasonBookingRequest, BookingResult>(
        "POST",
        `${PATH}/season/book-season`,
        request
    )
}