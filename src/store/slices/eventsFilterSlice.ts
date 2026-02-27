import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EventCategory } from "@/models/enums/event-category.enum";
import { EventsFilters } from "@/models/filters/events-filters.dto";

interface EventsFiltersState {
    filters: EventsFilters;
}

const initialState: EventsFiltersState = {
    filters: {
        page: 1,
        pageSize: 6,
        eventCategory: null
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
        setCategory: (state, action: PayloadAction<EventCategory | null>) => {
            state.filters.page = 1;
            state.filters.eventCategory = action.payload;
        }
    }
});

export const { setPage, setPageSize, setTextFilter, setCategory } = eventsFilterSlice.actions;
export default eventsFilterSlice.reducer;