import { Box } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";

import { whiteLabel } from "@/config/whiteLabel";

import RegisterPageClient from "./RegisterPageClient";

export const metadata: Metadata = {
    title: `Regístrate en ${whiteLabel.brandName}`,
    description:
        "Encuentra los mejores eventos en vivo: conciertos, fútbol, teatro y espectáculos. Compra boletos fácil, rápido y seguro.",
    keywords: ["eventos", "boletos", "conciertos", "fútbol", "teatro", "tickets"],
    authors: [{ name: whiteLabel.brandName }],
    robots: "index, follow",
    openGraph: {
        title: `Eventos en vivo | ${whiteLabel.brandName}`,
        description:
            "Compra tickets para conciertos, fútbol y teatro. Vive la experiencia.",
        url: "https://dev.com",
        siteName: whiteLabel.brandName,
        images: [
            {
                url: "https://dev.com/",
                width: 1200,
                height: 630,
                alt: "Eventos",
            },
        ],
        locale: "es_MX",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `Eventos | ${whiteLabel.brandName}`,
        description: "Boletos para conciertos, fútbol y teatro.",
        images: ["https://dev.com"],
    },
};

export default function RegisterPage() {
    return (
        <Box sx={{ minHeight: "100vh", py: { xs: 16, md: 20 } }}>
            <Suspense fallback={null}>
                <RegisterPageClient />
            </Suspense>
        </Box>
    );
}
