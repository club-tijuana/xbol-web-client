import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HoldToken } from "@seatsio/seatsio-react";

import { ItemType } from "@/models/enums/item-type.enum";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { ClientInfoRequest } from "@/models/requests/client-info-request.dto";
import { PaymentInfoRequest } from "@/models/requests/payment-info-request.dto";
import { BookingMode } from "@/types/bookingMode";
import { RenovationType } from "@/types/renovationType";

interface HoldTokenState {
    token: string;
    expiresInSeconds: number;
    status: "active" | "expired";
}

interface BookingFlowState {
    scheduleId?: number;
    bookMode?: BookingMode;
    renovationType?: RenovationType;
    holdTokenObj?: HoldTokenState;
    selectedSeatsDto: MyEventSeatDTO[] | undefined;
    selectedSeats?: Array<[string, number]>;
    initialSeats?: Array<[string, number]>;
    bookKey?: string;
    ticketType?: ItemType;
    clientContact?: ClientInfoRequest;
    paymentInfo?: PaymentInfoRequest;
    referenceOrderId?: number;
    orderLeftSeats?: number;
}

const initialState: BookingFlowState = {
    bookMode: undefined,
    selectedSeatsDto: undefined,
    selectedSeats: undefined,
    holdTokenObj: undefined,
};

export const expireHoldToken = createAsyncThunk<
    string,
    void,
    { state: { booking: BookingFlowState } }
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

const bookingFlowSlice = createSlice({
    name: "bookingFlow",
    initialState,
    reducers: {
        resetState: () => initialState,
        setBookMode: (state, action: PayloadAction<"event" | "season" | "renovateSeason">) => { // TODO: Use ticket type
            state.bookMode = action.payload;
        },
        setBookHoldToken: (state, action: PayloadAction<HoldToken>) => {
            const tokenState: HoldTokenState = { token: action.payload.token, expiresInSeconds: action.payload.expiresInSeconds, status: "active" };
            state.holdTokenObj = tokenState;
        },
        setSeatsDto: (state, action: PayloadAction<MyEventSeatDTO[]>) => {
            state.selectedSeatsDto = action.payload;
        },
        setSeats: (state, action: PayloadAction<Array<[string, number]>>) => {
            state.selectedSeats = action.payload;
        },
        setBookKey: (state, action: PayloadAction<string>) => {
            state.bookKey = action.payload;
        },
        setBookTicketType: (state, action: PayloadAction<ItemType>) => {
            state.ticketType = action.payload;
        },
        setBookClientContact: (state, action: PayloadAction<ClientInfoRequest>) => {
            state.clientContact = action.payload;
        },
        setBookPaymentInfo: (state, action: PayloadAction<PaymentInfoRequest>) => {
            state.paymentInfo = action.payload
        },
        setSeasonRelatedOrderId: (state, action: PayloadAction<number>) => {
            state.referenceOrderId = action.payload;
        },
        setRenovationType: (state, action: PayloadAction<RenovationType>) => {
            state.renovationType = action.payload;
        },
        setInitialSeats: (state, action: PayloadAction<Array<[string, number]>>) => {
            state.initialSeats = action.payload;
        },
        setOrderLeftSeats: (state, action: PayloadAction<number>) => {
            state.orderLeftSeats = action.payload;
        }
    }
});

export const {
    resetState,
    setBookMode,
    setBookHoldToken,
    setSeatsDto,
    setSeats,
    setBookKey,
    setBookTicketType,
    setBookClientContact,
    setBookPaymentInfo,
    setSeasonRelatedOrderId,
    setRenovationType,
    setInitialSeats,
    setOrderLeftSeats
} = bookingFlowSlice.actions;
export default bookingFlowSlice.reducer;