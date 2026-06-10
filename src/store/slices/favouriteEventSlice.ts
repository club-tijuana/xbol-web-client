import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getFavoritesIdsByClientId } from "@/services/clientFavoriteEventService";

interface FavouriteEventState {
    eventIds: Record<number, true>;
    loading: boolean
};

const initialState: FavouriteEventState = {
    eventIds: {},
    loading: false
};

export const loadFavorites = createAsyncThunk(
    "favoriteEvents/loadFavorites",
    async () => {
        const result = await getFavoritesIdsByClientId();
        return result;
    }
);

const favouriteEventSlice = createSlice({
    name: "favouriteEvents",
    initialState,
    reducers: {
        resetState: () => initialState,
        toggleFavourite: (state, action: PayloadAction<number>) => {
            const id = action.payload;

            if (state.eventIds[id]) {
                delete state.eventIds[id];
            }
            else {
                state.eventIds[id] = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadFavorites.fulfilled, (state, action) => {
                state.loading = false;

                state.eventIds = action.payload.reduce((acc, id) => {
                    acc[id] = true;
                    return acc;
                }, {} as Record<number, true>);
            })
            .addCase(loadFavorites.rejected, (_, action) => {
                console.log(action.error);
                //state.loading = false;
            });
    }
});

export const {
    resetState,
    toggleFavourite,
} = favouriteEventSlice.actions;
export default favouriteEventSlice.reducer;