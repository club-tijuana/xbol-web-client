import { Box, CircularProgress } from "@mui/material";

interface LoaderProps {
    isLoading: boolean;
}

export default function Loader({ isLoading }: LoaderProps) {
    return (
        <>
            {isLoading &&
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 10000,
                        backgroundColor: "#31313152",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size="3rem" />
                </Box>
            }
        </>
    );
}