import { Box } from "@mui/material";
import { Suspense } from "react";

import RegisterPageClient from "./RegisterPageClient";

export default function RegisterPage() {
    return (
        <Box sx={{ minHeight: "100vh", py: { xs: 16, md: 20 } }}>
            <Suspense fallback={null}>
                <RegisterPageClient />
            </Suspense>
        </Box>
    );
}
