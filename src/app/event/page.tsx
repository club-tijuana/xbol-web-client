import { Box } from "@mui/material";
import { Metadata } from "next";

import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import EventsSearch from "./components/EventsSearch/EventsSearch";

export function generateMetadata(): Metadata {
  const title = "Búsqueda de eventos";
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

export default async function EventPage() {
  return (
    <Box sx={{ minHeight: "100vh" }} mt={20}>
      <EventsSearch />
    </Box>
  );
}
