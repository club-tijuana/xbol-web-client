import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MyEventSeatDTO } from "@/models/my-event-seat.dto";

interface BookingPayload {
    eventId: number;
    selectedSeats: MyEventSeatDTO[];
}

interface BookingState {
    eventId: number | null;
    selectedSeatsDto: MyEventSeatDTO[] | undefined;
    selectedSeats: Array<string> | undefined;
    status: "idle" | "loading" | "success" | "error";
    error?: string;
}

const initialState: BookingState = {
    eventId: null,
    selectedSeatsDto: undefined,
    selectedSeats: undefined,
    status: "idle"
};

export const book = createAsyncThunk<
    boolean,
    BookingPayload,
    { rejectValue: string }
>(
    "booking/book",
    async ({ eventId, selectedSeats }, thunkAPI) => {
        try {
            // TODO: Implement a reservation service
            return true;
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

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setEventId: (state, action: PayloadAction<number>) => {
            state.eventId = action.payload;
        },
        setSeatsDto: (state, action: PayloadAction<MyEventSeatDTO[]>) => {
            state.selectedSeatsDto = action.payload;
        },
        setSeats: (state, action: PayloadAction<string[]>) => {
            state.selectedSeats = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(book.pending, (state) => {
                state.status = "loading";
            })
            .addCase(book.fulfilled, (state, action) => {
                state.status = "success";
            })
            .addCase(book.rejected, (state) => {
                state.status = "error";
            });
    }
});

export const { setEventId, setSeatsDto, setSeats } = bookingSlice.actions;
export default bookingSlice.reducer;