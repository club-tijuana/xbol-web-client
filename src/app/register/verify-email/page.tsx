import { Box } from "@mui/material";

import EmailVerificationStatus from "@/components/EmailVerificationStatus/EmailVerificationStatus";

export default function VerifyEmailPage() {
    return (
        <Box sx={{ minHeight: "100vh", py: { xs: 16, md: 20 } }}>
            <EmailVerificationStatus />
        </Box>
    );
}
