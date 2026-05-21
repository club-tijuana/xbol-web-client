"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import AuthStateBridge from "./AuthStateBridge";

import { store, persistor } from "./index";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthStateBridge />
                {children}
            </PersistGate>
        </Provider>
    );
}
