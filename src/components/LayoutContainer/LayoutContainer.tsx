"use client";

import { Box, useTheme } from "@mui/material";

export function LayoutContainer({ children }: { children: React.ReactNode }) {
    const theme = useTheme();

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
