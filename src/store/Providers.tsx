"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./index";

const AuthStateBridge = dynamic(() => import("./AuthStateBridge"), {
    ssr: false,
});

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
