"use client";

import { useEffect } from "react";

import { AuthDto } from "@/models/auth.dto";
import { clearClientAuthentication, hydrateAuthProfile } from "@/services/authService";
import { mapFirebaseUser, onClientAuthTokenChanged } from "@/services/firebaseClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, setUser } from "@/store/slices/authSlice";

export default function AuthStateBridge() {
    const dispatch = useAppDispatch();
    const authStatus = useAppSelector(state => state.auth.status);

    useEffect(() => {
        return onClientAuthTokenChanged(async (user) => {
            if (!user) {
                dispatch(logout());
                return;
            }

            if (authStatus === "loading") {
                return;
            }

            const firebaseUser = await mapFirebaseUser(user);
            let authProfile: AuthDto | null;

            try {
                authProfile = await hydrateAuthProfile(firebaseUser);
            } catch {
                return;
            }

            if (!authProfile) {
                await clearClientAuthentication();
                dispatch(logout());
                return;
            }

            dispatch(setUser(authProfile));
        });
    }, [authStatus, dispatch]);

    return null;
}
