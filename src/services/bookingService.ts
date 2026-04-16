import { requestAxios } from "@/helpers/axiosHelper";
import { BookingResult } from "@/models/booking-result.dto";
import { EventItemDTO } from "@/models/event-item.dto";
import { ReservationFilters } from "@/models/filters/reservation-filters.dto";
import { EventBookingRequest } from "@/models/requests/event-booking-request.dto";
import { SeasonBookingRequest } from "@/models/requests/season-booking-request.dto";
import { SeasonItemDTO } from "@/models/season-item.dto";
import { SeatAvailabilityDTO } from "@/models/seat-availability.dto";
import { ZoneDTO } from "@/models/zone.dto";
import { store } from "@/store";

const PATH: string = "bookings";

export async function getZonesBySchedule(scheduleId: number): Promise<ZoneDTO[]> {
    return requestAxios<null, ZoneDTO[]>(
        "GET",
        `${PATH}/zones-by-schedule/${scheduleId}`
    );
}

export async function getZonesBySeason(seasonId: number): Promise<ZoneDTO[]> {
    return requestAxios<null, ZoneDTO[]>(
        "GET",
        `${PATH}/zones-by-season/${seasonId}`
    );
}

export async function getEventItemBySchedule(
    scheduleId: number,
    signal?: AbortSignal,
): Promise<EventItemDTO> {
    return requestAxios<null, EventItemDTO>(
        "GET",
        `${PATH}/event-by-schedule/${scheduleId}`,
        undefined,
        undefined,
        { signal }
    );
}

export async function getSeasonById(
    seasonId: number,
    signal?: AbortSignal,
): Promise<SeasonItemDTO> {
    const state = store.getState();

    return requestAxios<null, SeasonItemDTO>(
        "GET",
        `${PATH}/season-by-id/${seasonId}`,
        undefined,
        state.auth.user?.token,
        { signal }
    );
}

export async function getSeatsAvailability(filters: ReservationFilters): Promise<SeatAvailabilityDTO> {
    return requestAxios<ReservationFilters, SeatAvailabilityDTO>(
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
    );
}

export async function seasonRenovationSeats(request: SeasonBookingRequest): Promise<BookingResult> {
    return requestAxios<SeasonBookingRequest, BookingResult>(
        "POST",
        `${PATH}/season/renovate-season`,
        request
    );
}