import type { Metadata } from "next";

interface SeoOptions {
    title: string;
    description: string;
    url: string;
    image: string;
    type?: "article" | "website";
}

export function buildSeoMetadata({
    title,
    description,
    url,
    image,
    type = "article",
}: SeoOptions): Metadata {
    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "PWRTicket",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: "es_MX",
            type,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
        robots: "index, follow",
    };
}