import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { BookSeatsBody } from "@/models/requests/book-seats-body.dto";
import { seasonRenovationSeats } from "@/services/bookingService";
import { bookSeats } from "@/services/seatManagementService";

import { RootState } from "..";

interface BookingState {
    status: "idle" | "loading" | "success" | "error";
    error?: string;
}

const initialState: BookingState = {
    status: "idle"
};

const getEventBookingRequest = (state: RootState): BookSeatsBody => {
    const flow = state.bookingFlow;

    return {
        seats: flow.selectedSeats ?? [],
        holdToken: flow.holdTokenObj?.token ?? "",
        bundleId: undefined,
        eventScheduleId: flow.scheduleId!,
        ticketType: flow.ticketType!,
        clientContact: flow.clientContact!,
        paymentInfoRequest: flow.paymentInfo!,
        isPaymentLink: false
    };
};

const getSeasonBookingRequest = (state: RootState): BookSeatsBody => {
    const flow = state.bookingFlow;

    return {
        seats: flow.selectedSeats ?? [],
        holdToken: flow.holdTokenObj?.token ?? "",
        bundleId: flow.bundleId!,
        eventScheduleId: undefined,
        ticketType: flow.ticketType!,
        clientContact: flow.clientContact!,
        paymentInfoRequest: flow.paymentInfo!,
        referenceOrderId: flow.referenceOrderId!,
        isPaymentLink: false
    }
}

export const eventBook = createAsyncThunk(
    "event/book",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const request = getEventBookingRequest(state);

            const response = await bookSeats(request);
            return response;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Error al reservar los asientos del evento")
            );
        }
    }
);

export const seasonBook = createAsyncThunk(
    "season/book",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const request = getSeasonBookingRequest(state);

            //const response = await seasonBookSeats(request);
            const response = await bookSeats(request);
            return response;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Error al reservar los asientos de la temporada")
            );
        }
    }
);

export const seasonRenovate = createAsyncThunk(
    "season/renovate",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const request = getSeasonBookingRequest(state);

            const response = await seasonRenovationSeats(request);
            return response;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Error al renovar los asientos de la temporada")
            );
        }
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(eventBook.pending, (state) => {
                state.status = "loading";
            })
            .addCase(eventBook.fulfilled, (state) => {
                state.status = "success";
            })
            .addCase(eventBook.rejected, (state) => {
                state.status = "error";
            })
            .addCase(seasonBook.pending, (state) => {
                state.status = "loading";
            })
            .addCase(seasonBook.fulfilled, (state) => {
                state.status = "success";
            })
            .addCase(seasonBook.rejected, (state) => {
                state.status = "error";
            })
            .addCase(seasonRenovate.pending, (state) => {
                state.status = "loading";
            })
            .addCase(seasonRenovate.fulfilled, (state) => {
                state.status = "success";
            })
            .addCase(seasonRenovate.rejected, (state) => {
                state.status = "error";
            });
    }
});

export const {
    resetState,
} = bookingSlice.actions;
export default bookingSlice.reducer;