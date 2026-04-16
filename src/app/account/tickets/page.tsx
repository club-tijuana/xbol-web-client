import { Box, Grid } from "@mui/material";
import { Metadata } from "next";

import Advertisement from "@/components/Advertisement/Advertisement";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";
import advertisementImage from "@public/assets/images/advertisement/advertisement.png";

import TicketsClientWrapper from "./components/TicketsClientWrapper/TicketsClientWrapper";

export function generateMetadata(): Metadata {
    const title = "Mis tickets";
    const description =
        "Consulta todos los eventos y Season Pass en los que tienes tickets. Accede a tus entradas y mantente al día con tus próximos eventos.";
    const url = "https://dev.com/mis-eventos/";

    return buildSeoMetadata({
        title,
        description,
        url,
        image: "/og-default.jpg",
        type: "website",
    });
}

export default async function TicketsPage() {
    // TODO: restore "Otros eventos" trending-events grid (re-wire getTrendingEvents + EventCardGrid in the right column)

    return (
        <Box mt={13} sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            mt: 13
        }}>
            <TicketsClientWrapper />

            <Grid container
                columns={2}
                mb={8}
                spacing={6}
                sx={{
                    mt: { sx: 0, sm: 3, md: 3, lg: 6, xl: 6 }
                }}
            >
                <Grid size={{ xs: 2, sm: 2, md: 2, lg: 1, xl: 1 }}>
                    <Advertisement image={advertisementImage} />
                </Grid>
            </Grid>
        </Box>
    );
}
