import { Metadata } from "next";

import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import FavouritesClientWrapper from "./components/FavouritesClientWrapper/FavouritesClientWrapper";

export function generateMetadata(): Metadata {
    const title = "Mis favoritos";
    const description = "";
    const url = "";

    return buildSeoMetadata({
        title,
        description,
        url,
        image: "/og-default.jpg",
        type: "website",
    });
}

export default function FavouritesPage() {
    return (
        <FavouritesClientWrapper />
    );
}