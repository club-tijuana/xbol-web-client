import { Metadata } from "next";

import HomeClientWrapper from "./event/components/HomeClientWrapper/HomeClientWrapper";

export const metadata: Metadata = {
  title: "Compra boletos para conciertos, fútbol y teatro | PWRTicket",
  description:
    "Encuentra los mejores eventos en vivo: conciertos, fútbol, teatro y espectáculos. Compra boletos fácil, rápido y seguro.",
  keywords: ["eventos", "boletos", "conciertos", "fútbol", "teatro", "tickets"],
  authors: [{ name: "PWRTicket" }],
  robots: "index, follow",
  openGraph: {
    title: "Eventos en vivo | PWRTicket",
    description:
      "Compra boletos para conciertos, fútbol y teatro. Vive la experiencia.",
    url: "https://dev.com",
    siteName: "PWRTicket",
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
    title: "Eventos | PWRTicket",
    description: "Boletos para conciertos, fútbol y teatro.",
    images: ["https://dev.com"],
  },
};

export default async function Home() {
  return (
    <div>
      <main>
        {
          <HomeClientWrapper></HomeClientWrapper>
        }
      </main>
    </div>
  );
}
