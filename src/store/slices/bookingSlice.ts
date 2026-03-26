import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HoldToken } from "@seatsio/seatsio-react";

import { BookingResult } from "@/models/booking-result.dto";
import { ItemType } from "@/models/enums/item-type.enum";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { ClientInfoRequest } from "@/models/requests/client-info-request.dto";
import { EventBookingRequest } from "@/models/requests/event-booking-request.dto";
import { PaymentInfoRequest } from "@/models/requests/payment-info-request.dto";
import { SeasonBookingRequest } from "@/models/requests/season-booking-request.dto";
import { eventBookSeats, seasonBookSeats } from "@/services/bookingService";

interface HoldTokenState {
    token: string;
    expiresInSeconds: number;
    status: "active" | "expired";
}

interface BookingState {
    bookMode?: "event" | "season";
    selectedSeatsDto: MyEventSeatDTO[] | undefined;
    selectedSeats?: Array<[string, number]>;
    eventBookingRequest?: EventBookingRequest;
    seasonBookingRequest?: SeasonBookingRequest;
    status: "idle" | "loading" | "success" | "error";
    holdTokenObj?: HoldTokenState;
    error?: string;
}

const initialState: BookingState = {
    bookMode: undefined,
    selectedSeatsDto: undefined,
    selectedSeats: undefined,
    eventBookingRequest: undefined,
    seasonBookingRequest: undefined,
    holdTokenObj: undefined,
    status: "idle"
};

function createEventBookingRequest(): EventBookingRequest {
    return {
        eventKey: "",
        scheduleId: 0,
        seats: [],
        ticketType: ItemType.Ticket,
        clientContact: {} as ClientInfoRequest,
        paymentInfoRequest: {
            cardAmount: 0,
            cashAmount: 0,
            creditAmount: 0,
            dolarAmount: 0,
            exchangeRate: 0,
            isCourtesy: false,
            otherAmount: 0
        }
    };
}

function createSeasonBookingRequest(): SeasonBookingRequest {
    return {
        scheduleId: 0,
        seats: undefined,
        ticketType: ItemType.SeasonPass,
        clientContact: {} as ClientInfoRequest,
        paymentInfoRequest: {} as PaymentInfoRequest,
    };
}

export const eventBook = createAsyncThunk<
    BookingResult,
    EventBookingRequest,
    { rejectValue: string }
>(
    "event/book",
    async (request, thunkAPI) => {
        try {
            const response = await eventBookSeats(request);
            return response;
        }
        catch (error: unknown) {
            let message = "Error al reservar los asientos";

            if (error instanceof Error) {
                message = error.message;
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const seasonBook = createAsyncThunk<
    BookingResult,
    SeasonBookingRequest,
    { rejectValue: string }
>(
    "season/book",
    async (request, thunkAPI) => {
        try {
            const response = await seasonBookSeats(request);
            return response;
        }
        catch (error: unknown) {
            let message = "Error al reservar los asientos";

            if (error instanceof Error) {
                message = error.message;
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const expireHoldToken = createAsyncThunk<
    string,
    void,
    { state: { booking: BookingState } }
>(
    "booking/expireHoldToken",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState().booking;
        const token = state.holdTokenObj?.token;

        if (!token) {
            throw new Error("No hold token to expire");
        }

        return token;
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        resetState: () => initialState,
        setBookMode: (state, action: PayloadAction<"event" | "season">) => { // TODO: Use ticket type
            state.bookMode = action.payload;
            state.eventBookingRequest = undefined;
            state.seasonBookingRequest = undefined;
        },
        setBookScheduleId: (state, action: PayloadAction<number>) => {
            if (state.bookMode === "event") {
                state.eventBookingRequest ??= createEventBookingRequest();
                state.eventBookingRequest.scheduleId = action.payload;
            }
            else if (state.bookMode === "season") {
                state.seasonBookingRequest ??= createSeasonBookingRequest();
                state.seasonBookingRequest.scheduleId = action.payload;
            }
        },
        setBookKey: (state, action: PayloadAction<string>) => {
            if (state.bookMode === "event") {
                state.eventBookingRequest ??= createEventBookingRequest();
                state.eventBookingRequest.eventKey = action.payload;
            }
            else if (state.bookMode === "season") {
                state.seasonBookingRequest ??= createSeasonBookingRequest();
                state.seasonBookingRequest.seasonKey = action.payload;
            }
        },
        setBookSeats: (state, action: PayloadAction<Array<[string, number]>>) => {
            const seatsArray = action.payload;
            const seatsObject = Object.fromEntries(seatsArray);

            if (state.bookMode === "event") {
                state.eventBookingRequest ??= createEventBookingRequest();
                state.eventBookingRequest.seats = seatsObject;
                //state.eventBookingRequest.seatsObjs = seatsObject;
            }
            else if (state.bookMode === "season") {
                state.seasonBookingRequest ??= createSeasonBookingRequest();
                state.seasonBookingRequest.seats = seatsObject;
                //state.seasonBookingRequest.seatsObjs = seatsObject;
            }
        },
        setBookHoldToken: (state, action: PayloadAction<HoldToken>) => {
            const tokenState: HoldTokenState = { token: action.payload.token, expiresInSeconds: action.payload.expiresInSeconds, status: "active" };
            state.holdTokenObj = tokenState;

            if (state.bookMode === "event") {
                state.eventBookingRequest ??= createEventBookingRequest();
                state.eventBookingRequest.holdToken = action.payload.token;
            }
            else if (state.bookMode === "season") {
                state.seasonBookingRequest ??= createSeasonBookingRequest();
                state.seasonBookingRequest.holdToken = action.payload.token;
            }
        },
        setBookTicketType: (state, action: PayloadAction<ItemType>) => {
            if (state.bookMode === "event") {
                state.eventBookingRequest ??= createEventBookingRequest();
                state.eventBookingRequest.ticketType = action.payload;
            }
            else if (state.bookMode === "season") {
                state.seasonBookingRequest ??= createSeasonBookingRequest();
                state.seasonBookingRequest.ticketType = action.payload;
            }
        },
        setBookClientContact: (state, action: PayloadAction<ClientInfoRequest>) => {
            if (state.bookMode === "event") {
                state.eventBookingRequest ??= createEventBookingRequest();
                state.eventBookingRequest.clientContact = action.payload;
            }
            else if (state.bookMode === "season") {
                state.seasonBookingRequest ??= createSeasonBookingRequest();
                state.seasonBookingRequest.clientContact = action.payload;
            }
        },
        setBookPaymentInfo: (state, action: PayloadAction<PaymentInfoRequest>) => {
            if (state.bookMode === "event") {
                state.eventBookingRequest ??= createEventBookingRequest();
                state.eventBookingRequest.paymentInfoRequest = action.payload;
            }
            else if (state.bookMode === "season") {
                state.seasonBookingRequest ??= createSeasonBookingRequest();
                state.seasonBookingRequest.paymentInfoRequest = action.payload;
            }
        },
        setSeatsDto: (state, action: PayloadAction<MyEventSeatDTO[]>) => {
            state.selectedSeatsDto = action.payload;
        },
        setSeats: (state, action: PayloadAction<Array<[string, number]>>) => {
            state.selectedSeats = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(eventBook.pending, (state) => {
                state.status = "loading";
            })
            .addCase(eventBook.fulfilled, (state, action) => {
                state.status = "success";
            })
            .addCase(eventBook.rejected, (state) => {
                state.status = "error";
            })
            .addCase(seasonBook.pending, (state) => {
                state.status = "loading";
            })
            .addCase(seasonBook.fulfilled, (state, action) => {
                state.status = "success";
            })
            .addCase(seasonBook.rejected, (state) => {
                state.status = "error";
            })
            .addCase(expireHoldToken.fulfilled, (state, action) => {
                if (state.holdTokenObj?.token === action.payload) {
                    state.holdTokenObj.status = "expired";
                }
            });
    }
});

export const {
    resetState,
    setBookMode,
    setBookScheduleId,
    setBookKey,
    setBookSeats,
    setBookHoldToken,
    setBookTicketType,
    setBookClientContact,
    setBookPaymentInfo,
    setSeatsDto,
    setSeats
} = bookingSlice.actions;
export default bookingSlice.reducer;