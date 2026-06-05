import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HoldToken } from "@seatsio/seatsio-react";

import { ItemType } from "@/models/enums/item-type.enum";
import { ClientInfoRequest } from "@/models/requests/client-info-request.dto";
import { PaymentInfoRequest } from "@/models/requests/payment-info-request.dto";
import { ReleaseSeatsByKeyRequest } from "@/models/requests/release-seats-by-key-request.dto";
import { releaseSeats } from "@/services/holdService";
import { BookingMode } from "@/types/bookingMode";
import { RenovationType } from "@/types/renovationType";

import { RootState } from "..";

interface HoldTokenState {
    token: string;
    expiresInSeconds: number;
    status: "active" | "expired" | "manualExpired";
}

interface BookingFlowState {
    scheduleId?: number;
    bookMode?: BookingMode;
    renovationType?: RenovationType;
    holdTokenObj?: HoldTokenState;
    selectedSeats?: Array<[string, number]>;
    initialSeats?: Array<[string, number]>;
    bookKey: string;
    ticketType?: ItemType;
    clientContact?: ClientInfoRequest;
    paymentInfo?: PaymentInfoRequest;
    referenceOrderId?: number;
    orderLeftSeats?: number;
    originalSeats?: Array<[string, number]>;
}

const initialState: BookingFlowState = {
    bookMode: undefined,
    selectedSeats: undefined,
    holdTokenObj: undefined,
    bookKey: ''
};

export const expireHoldToken = createAsyncThunk<
    { type: "auto" | "manual" },
    { type: "auto" | "manual" },
    { state: RootState }
>(
    "bookingFlow/expireHoldToken",
    async ({ type }, thunkAPI) => {
        const state = thunkAPI.getState().bookingFlow;

        const token = state.holdTokenObj?.token;
        const bookKey = state.bookKey;
        const seatsLabels = state.selectedSeats?.map(s => s[0]);
        const newSeats = state.selectedSeats;

        if (!newSeats) {
            return { type };
        }

        if (!token) {
            return { type };
        }

        if (!bookKey) {
            throw new Error("No event key provided");
        }
        if (!seatsLabels || seatsLabels.length === 0) {
            throw new Error("No seats selected");
        }

        const payload: ReleaseSeatsByKeyRequest = {
            eventKey: bookKey,
            seats: seatsLabels,
            holdToken: token
        };

        try {
            await releaseSeats(payload);
        }
        catch {

        }

        return { type };
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
        },
        setOriginalSeats: (state, action: PayloadAction<Array<[string, number]>>) => {
            state.originalSeats = action.payload;
        },
        manualExpireHoldToken: (state) => {
            if (state.holdTokenObj) {
                state.holdTokenObj.status = "manualExpired";
                state.holdTokenObj.token = "";
                state.initialSeats = state.originalSeats;
            }
        },
        clearHoldToken: (state) => {
            state.holdTokenObj = undefined;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(expireHoldToken.fulfilled, (state, action) => {
            if (state.holdTokenObj) {
                state.holdTokenObj.status =
                    action.payload?.type === "manual"
                        ? "manualExpired"
                        : "expired";

                state.holdTokenObj.token = "";
                state.initialSeats = state.originalSeats;
            }
        });
    }
});

export const {
    resetState,
    setBookMode,
    setBookHoldToken,
    setSeats,
    setBookKey,
    setBookTicketType,
    setBookClientContact,
    setBookPaymentInfo,
    setSeasonRelatedOrderId,
    setRenovationType,
    setInitialSeats,
    setOrderLeftSeats,
    setOriginalSeats,
    manualExpireHoldToken,
    clearHoldToken
} = bookingFlowSlice.actions;
export default bookingFlowSlice.reducer;