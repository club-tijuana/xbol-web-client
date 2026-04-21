import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import bookingFlowReducer from "./slices/bookingFlowSlice";
import bookingReducer from "./slices/bookingSlice";
import eventsFiltersReducer from "./slices/eventsFilterSlice";
import favouriteEventReducer from "./slices/favouriteEventSlice";
import shareTicketReducer from "./slices/shareTicketSlice";
import uiReducer from "./slices/uiSlice";

const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["user"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: persistedAuthReducer,
        booking: bookingReducer,
        eventsFilters: eventsFiltersReducer,
        shareTicket: shareTicketReducer,
        favouriteEvents: favouriteEventReducer,
        bookingFlow: bookingFlowReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;