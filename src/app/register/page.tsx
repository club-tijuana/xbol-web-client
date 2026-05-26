import { Box } from "@mui/material";

import RegisterForm from "@/components/RegisterForm/RegisterForm";

export default function RegisterPage() {
    return (
        <Box sx={{ minHeight: "100vh", py: { xs: 16, md: 20 } }}>
            <RegisterForm />
        </Box>
    );
}
