import { requestAxios } from "@/helpers/axiosHelper";
import { BookingResult } from "@/models/booking-result.dto";
import { BookSeatsBody } from "@/models/requests/book-seats-body.dto";
import { store } from "@/store";

const PATH: string = "seat-management";

export async function bookSeats(request: BookSeatsBody): Promise<BookingResult> {
    const state = store.getState();

    return requestAxios<BookSeatsBody, BookingResult>(
        "POST",
        `${PATH}/book`,
        request,
        state.auth.user?.token
    );
}