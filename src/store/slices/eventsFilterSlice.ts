import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EventsFilters } from "@/models/filters/events-filters.dto";

interface EventsFiltersState {
    filters: EventsFilters;
}

const initialState: EventsFiltersState = {
    filters: {
        page: 1,
        pageSize: 6,
        eventCategoryIds: undefined,
        performerId: undefined
    }
};

const eventsFilterSlice = createSlice({
    name: "eventsFilters",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.filters.page = 1;
            state.filters.pageSize = action.payload;
        },
        setTextFilter: (state, action: PayloadAction<string | undefined>) => {
            state.filters.page = 1;
            state.filters.textFilter = action.payload;
        },
        setCategories: (state, action: PayloadAction<number[] | undefined>) => {
            state.filters.page = 1;
            state.filters.eventCategoryIds = action.payload;
        },
        setPerformerId: (state, action: PayloadAction<number | undefined>) => {
            state.filters.page = 1;
            state.filters.textFilter = '';
            state.filters.performerId = action.payload;
        }
    }
});

export const { setPage, setPageSize, setTextFilter, setCategories, setPerformerId } = eventsFilterSlice.actions;
export default eventsFilterSlice.reducer;