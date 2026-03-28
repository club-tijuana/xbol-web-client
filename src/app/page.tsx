// import { Box, Grid } from "@mui/material";
import { Metadata } from "next";

// import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
// import EventCarousel from "@/components/EventCarousel/EventCarousel";
// import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
// import { mapEventToCardVM } from "@/models/event-item.dto";
// import { getEvents, getMainEvents, getTrendingEvents } from "@/services/eventService";
// import { colors } from "@/theme/colors";
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
  // const mainEvents = await getMainEvents();
  // const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 6 });
  // const futbolEvents = await getEvents({ page: 1, eventCategoryId: 1, pageSize: 3 });
  // const musicEvents = await getEvents({ page: 1, eventCategoryId: 2, pageSize: 3 });
  // const theaterEvents = await getEvents({ page: 1, eventCategoryId: 3, pageSize: 3 });

  // const trendingEventsVM = trendingEvents.items.map(mapEventToCardVM);
  // const futbolEventsVM = futbolEvents.items.map(mapEventToCardVM);
  // const musicEventsVM = musicEvents.items.map(mapEventToCardVM);
  // const theaterEventsVM = theaterEvents.items.map(mapEventToCardVM);

  return (
    <div>
      <main>
        {
          <HomeClientWrapper></HomeClientWrapper>
          /* <FullWidthSection fullBleed={true} disableMaxWidth={true}>
          <EventCarousel events={mainEvents.items} />
        </FullWidthSection>

        <Grid container columns={12} mt={6} mb={5}>
          <Grid size={12}>
            <EventCardGrid
              title="Eventos destacados"
              eventCards={trendingEventsVM}
              sizeVariant="sm"
              styleVariant="default"
              showCardBadge={true}
            />
          </Grid>
        </Grid>

        <FullWidthSection variant="imageFull" image="/assets/images/separators/soccer-separator-light.png">
          <Box sx={{ paddingBottom: 6, paddingTop: 6 }}>
            <EventCardGrid
              title="Fútbol"
              eventCards={futbolEventsVM}
              sizeVariant="lg"
              styleVariant="dark"
              showCardBadge={true}
            />
          </Box>
        </FullWidthSection>

        <Box mt={6} mb={3}>
          <EventCardGrid
            title="Música"
            eventCards={musicEventsVM}
            sizeVariant="lg"
            styleVariant="muted"
          />
        </Box>


        <FullWidthSection variant="color" backgroundColor={colors.brand.background} fullBleed={false}>
          <Box mt={8} mb={6.5}>
            <EventCardGrid
              title="Otros eventos"
              eventCards={theaterEventsVM}
              sizeVariant="md"
              styleVariant="muted"
              showCardBadge={true}
            />
          </Box>
        </FullWidthSection> */
        }
      </main>
    </div>
  );
}
