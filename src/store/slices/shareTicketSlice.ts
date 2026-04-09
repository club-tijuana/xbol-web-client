import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { ShareTicket } from "@/models/requests/share-ticket.dto";
import { UnshareTicket } from "@/models/requests/unshare-ticket.dto";
import { shareTicket, unshareTicket } from "@/services/ticketService";

interface ShareTicketState {
    sharedTicket: MyTicketDto | null;
    status: "idle" | "loading" | "success" | "error";
    error?: string;
};

const initialState: ShareTicketState = {
    sharedTicket: null,
    status: "idle"
};

export const share = createAsyncThunk<
    MyTicketDto,
    ShareTicket,
    { rejectValue: string }
>(
    "ticket/share",
    async (payload, thunkAPI) => {
        try {
            const response = await shareTicket(payload);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Error al compartir ticket")
            );
        }
    }
);

export const unshare = createAsyncThunk<
    undefined,
    UnshareTicket,
    { rejectValue: string }
>(
    "ticket/unshare",
    async (payload, thunkAPI) => {
        try {
            await unshareTicket(payload);
            return;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Error al dejar de compartir ticket")
            );
        }
    }
);

const shareTicketSlice = createSlice({
    name: "shareTicket",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            state.error = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(share.pending, (state) => {
                state.status = "loading";
                state.error = undefined;
                state.sharedTicket = null;
            })
            .addCase(share.fulfilled, (state, action) => {
                state.status = "success";
                state.sharedTicket = action.payload;
            })
            .addCase(share.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload ?? "Error desconocido";
            })
            .addCase(unshare.pending, (state) => {
                state.status = "loading";
                state.error = undefined;
            })
            .addCase(unshare.fulfilled, (state) => {
                state.status = "success";
            })
            .addCase(unshare.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload ?? "Error desconocido";
            });
    }
});

export const {
    resetStatus
} = shareTicketSlice.actions;
export default shareTicketSlice.reducer;