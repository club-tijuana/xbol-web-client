import { Box, Grid } from "@mui/material";
import { Metadata } from "next";

import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCarousel from "@/components/EventCarousel/EventCarousel";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { EventCategory } from "@/models/enums/event-category.enum";
import { getEvents, getMainEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";

export const metadata: Metadata = {
  title: "Compra boletos para conciertos, fútbol y teatro | PWRTicket",
  description: "Encuentra los mejores eventos en vivo: conciertos, fútbol, teatro y espectáculos. Compra boletos fácil, rápido y seguro.",
  keywords: ["eventos", "boletos", "conciertos", "fútbol", "teatro", "tickets"],
  authors: [{ name: "PWRTicket" }],
  robots: "index, follow",
  openGraph: {
    title: "Eventos en vivo | PWRTicket",
    description: "Compra boletos para conciertos, fútbol y teatro. Vive la experiencia.",
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
  const mainEvents = await getMainEvents();
  const featuredEvents = await getEvents({ page: 1, eventCategory: EventCategory.Concert, pageSize: 6 });
  const futbolEvents = await getEvents({ page: 1, eventCategory: EventCategory.Sports, pageSize: 3 });
  const musicEvents = await getEvents({ page: 1, eventCategory: EventCategory.Concert, pageSize: 3 });
  const theaterEvents = await getEvents({ page: 1, eventCategory: EventCategory.Theater, pageSize: 3 });

  return (
    <div>
      <main>
        <FullWidthSection fullBleed={true} disableMaxWidth={true}>
          <EventCarousel events={mainEvents.items} />
        </FullWidthSection>

        <Grid container columns={12} mt={6} mb={5}>
          <Grid size={12}>
            <EventCardGrid
              title="Eventos destacados"
              titleAlign="center"
              eventCards={featuredEvents.items}
              columns={{ xs: 2, sm: 3, md: 4, lg: 6, xl: 6 }}
              itemSize={1}
              spacing={3}
              size="sm"
              cardTitleColor={colors.light.text}
              showCardBadge={true}
              cardBadgeType="dark"
              cardImageHeights={{ xs: 180, sm: 210, md: 220, lg: 190, xl: 200 }}
            />
          </Grid>
        </Grid>

        <FullWidthSection variant="imageFull" image="/assets/images/separators/soccer-separator-light.png">
          <Box sx={{ paddingBottom: 6, paddingTop: 6 }}>
            <EventCardGrid
              title="Fútbol"
              eventCards={futbolEvents.items}
              columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
              itemSize={1}
              spacing={4}
              cardDescriptionAlign="left"
              cardTitleAlign="left"
              cardTitleColor={colors.light.primary}
              showCardBadge={true}
              showAllButton={true}
              cardImageHeights={{ xs: 240, sm: 170, md: 170, lg: 210, xl: 200 }}
            />
          </Box>
        </FullWidthSection>

        <Box mt={6} mb={3}>
          <EventCardGrid
            title="Música"
            eventCards={musicEvents.items}
            columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
            itemSize={1}
            spacing={4}
            cardDescriptionAlign="left"
            cardTitleAlign="left"
            cardTitleColor={colors.light.secondary}
            cardDescriptionColor={colors.light.muted}
            showAllButton={true}
            cardImageHeights={{ xs: 240, sm: 170, md: 170, lg: 210, xl: 200 }}
          />
        </Box>


        <FullWidthSection variant="color" backgroundColor={colors.brand.background} fullBleed={false}>
          <Box mt={8} mb={6.5}>
            <EventCardGrid
              title="Otros eventos"
              eventCards={theaterEvents.items}
              columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
              itemSize={1}
              spacing={4}
              cardDescriptionAlign="left"
              cardTitleAlign="left"
              cardTitleColor={colors.light.secondary}
              cardDescriptionColor={colors.light.muted}
              showCardBadge={true}
              cardBadgeType="dark"
              cardImageHeights={{ xs: 200, sm: 200, md: 170, lg: 145, xl: 145 }}
              showAllButton={true}
            />
          </Box>
        </FullWidthSection>
      </main>
    </div>
  );
}
