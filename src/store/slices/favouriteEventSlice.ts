import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavouriteEventState {
    eventIds?: Array<number>;
};

const initialState: FavouriteEventState = {
    eventIds: undefined
};

const favouriteEventSlice = createSlice({
    name: "favouriteEvents",
    initialState,
    reducers: {
        resetState: () => initialState,
        toggleFavourite: (state, action: PayloadAction<number>) => {
            if (!state.eventIds) {
                state.eventIds = new Array<number>();
                state.eventIds.push(action.payload);
            }
            else {
                if (state.eventIds?.includes(action.payload)) {
                    state.eventIds = state.eventIds.filter(id => id !== action.payload);
                }
                else {
                    state.eventIds.push(action.payload);
                }
            }
        },
        setFavouritesList: (state, action: PayloadAction<number[]>) => {
            state.eventIds = action.payload;
        }
    }
});

export const {
    resetState,
    toggleFavourite,
    setFavouritesList
} = favouriteEventSlice.actions;
export default favouriteEventSlice.reducer;