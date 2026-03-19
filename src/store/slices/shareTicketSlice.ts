import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
        } catch (error: unknown) { // TODO: Make it a generic handler
            let message = "Error al compartir ticket";

            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                if (typeof data === "string") {
                    message = data;
                } else if (
                    typeof data === "object" &&
                    data !== null &&
                    "message" in data &&
                    typeof (data as { message?: unknown }).message === "string"
                ) {
                    message = (data as { message: string }).message;
                } else if (
                    typeof data === "object" &&
                    data !== null &&
                    "title" in data &&
                    typeof (data as { title?: unknown }).title === "string"
                ) {
                    message = (data as { title: string }).title;
                } else {
                    message = error.message;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }

            return thunkAPI.rejectWithValue(message);
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
        catch (error: unknown) {
            let message = "Error al dejar de compartir ticket";

            if (error instanceof Error) {
                message = error.message;
            }

            return thunkAPI.rejectWithValue(message);
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