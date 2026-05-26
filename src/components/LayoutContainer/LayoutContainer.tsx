"use client";

import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";

import { canUseVerifiedClientFeatures } from "@/helpers/authStateHelper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadFavorites } from "@/store/slices/favouriteEventSlice";

export function LayoutContainer({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);

    useEffect(() => {
        if (canUseVerifiedClientFeatures(user)) {
            dispatch(loadFavorites());
        }
    }, [dispatch, user]);

    return (
        <Box component="main"
            sx={{
                maxWidth: theme.customLayout.contentMaxWidth,
                mx: "auto",
                width: "100%",
                px: { xs: 3, sm: 3, md: 7, lg: 7, xl: 4 },
            }}
        >
            {children}
        </Box>
    );
}
