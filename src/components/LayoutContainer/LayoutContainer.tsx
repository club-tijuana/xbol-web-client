"use client";

import { Box, useTheme } from "@mui/material";

export function LayoutContainer({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    console.log("theme.CustomLayout:", theme.customLayout);

    return (
        <Box component="main"
            sx={{
                maxWidth: theme.customLayout.contentMaxWidth,
                mx: "auto",
                width: "100%",
                px: { xs: 2, md: 4, lg: 4, xl: 12 },
            }}
        >
            {children}
        </Box>
    );
}
