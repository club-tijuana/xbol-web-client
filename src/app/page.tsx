import { Box, Grid } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";

import ErrorNotifier from "@/components/ErrorNotifier/ErrorNotifier";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCarousel from "@/components/EventCarousel/EventCarousel";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import SeasonBanner from "@/components/SeasonBanner/SeasonBanner";
import { whiteLabel } from "@/config/whiteLabel";
import { BundleType } from "@/models/enums/bundle-type.enum";
import { EventCatalogItemType } from "@/models/enums/event-catalog-item-type.enum";
import { mapEventCatalogItemToCardVM } from "@/models/event-catalog-item.dto";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getEventCatalog } from "@/services/eventCatalogService";
import {
  getEvents,
  getMainEventsExtended,
  getTrendingEvents,
  getUpcomingEvents,
} from "@/services/eventService";
import { colors } from "@/theme/colors";
import { getSiteAccessLandingImages } from "@/utils/routing/siteAccessGate";

export const metadata: Metadata = {
  title: `Compra boletos para conciertos, fútbol y teatro | ${whiteLabel.brandName}`,
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

interface HomeProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const results = await Promise.allSettled([
    getMainEventsExtended(),
    getTrendingEvents({ page: 1, pageSize: 4 }),
    getEvents({ page: 1, eventCategoryId: 1, pageSize: 4 }),
    getEvents({ page: 1, eventCategoryId: 2, pageSize: 4 }),
    getEvents({ page: 1, eventCategoryId: 3, pageSize: 4 }),
    getUpcomingEvents({ page: 1, pageSize: 5 }),
    getEventCatalog({
      itemType: EventCatalogItemType.Bundle,
      bundleType: BundleType.Basic,
      page: 1,
      pageSize: 4,
      upcoming: true,
      buyableOnly: true,
    }),
  ]);

  const { error } = await searchParams;

  const [
    mainEventsResult,
    trendingEventsResult,
    futbolEventsResult,
    musicEventsResult,
    theaterEventsResult,
    upcomingEventsResult,
    bundleCatalogResult,
  ] = results;

  const mainEvents =
    mainEventsResult.status === "fulfilled" ? mainEventsResult.value : null;
  const heroEvents = mainEvents?.items ?? [];
  const {
    landingImageUrl: heroFallbackImageUrl,
    landingMobileImageUrl: heroFallbackMobileImageUrl,
  } = getSiteAccessLandingImages();

  const trendingEvents =
    trendingEventsResult.status === "fulfilled"
      ? trendingEventsResult.value
      : null;

  const futbolEvents =
    futbolEventsResult.status === "fulfilled" ? futbolEventsResult.value : null;

  const musicEvents =
    musicEventsResult.status === "fulfilled" ? musicEventsResult.value : null;

  const theaterEvents =
    theaterEventsResult.status === "fulfilled"
      ? theaterEventsResult.value
      : null;

  const upcomingEvents =
    upcomingEventsResult.status === "fulfilled"
      ? upcomingEventsResult.value
      : null;

  const bundleCatalog =
    bundleCatalogResult.status === "fulfilled"
      ? bundleCatalogResult.value
      : null;

  const hasErrors = results.some((r) => r.status === "rejected");

  return (
    <div>
      <ErrorNotifier show={hasErrors || !!error} errorMessage={error} />

      <main>
        <Box sx={{ minHeight: "100vh" }}>
          <FullWidthSection fullBleed={true} disableMaxWidth={true}>
            <EventCarousel
              events={heroEvents}
              fallbackImageUrl={heroFallbackImageUrl}
              fallbackMobileImageUrl={heroFallbackMobileImageUrl}
            />
          </FullWidthSection>
          {upcomingEvents && upcomingEvents.items.length > 0 && (
            <Grid container columns={12}>
              <Grid size={12}>
                <EventCardGrid
                  title="Próximos eventos"
                  eventCards={upcomingEvents.items.map((e) =>
                    mapEventToCardVM(e),
                  )}
                  sizeVariant="sm"
                  styleVariant="default"
                  showCardBadge={true}
                />
              </Grid>
            </Grid>
          )}

          {futbolEvents && futbolEvents.items.length > 0 && (
            <FullWidthSection
              variant="color"
              backgroundColor={colors.brand.secondary}
              topRounded={true}
              bottomRounded={true}
              hideOverflow={false}
            >
              <EventCardGrid
                title="Fútbol"
                eventCards={futbolEvents.items.map((e) => mapEventToCardVM(e))}
                sizeVariant="lg"
                styleVariant="dark"
                showCardBadge={true}
                showCardInfo={false}
              />
            </FullWidthSection>
          )}
          {musicEvents && musicEvents.items.length > 0 && (
            <Box>
              <EventCardGrid
                title="Música"
                eventCards={musicEvents.items.map((e) => mapEventToCardVM(e))}
                sizeVariant="lg"
                styleVariant="muted"
              />
            </Box>
          )}

          {theaterEvents && theaterEvents.items.length > 0 && (
            <FullWidthSection
              variant="color"
              backgroundColor={colors.ui.surface}
              topRounded={true}
              hideOverflow={false}
            >
              <EventCardGrid
                title="Teatro"
                eventCards={theaterEvents.items.map((e) => mapEventToCardVM(e))}
                sizeVariant="lg"
                styleVariant="light"
              />
            </FullWidthSection>
          )}

          {trendingEvents && trendingEvents.items.length > 0 && (
            <Grid container columns={12}>
              <Grid size={12}>
                <EventCardGrid
                  title="Otros eventos"
                  eventCards={trendingEvents.items.map((e) =>
                    mapEventToCardVM(e),
                  )}
                  sizeVariant="lg"
                  styleVariant="default"
                  showCardBadge={true}
                />
              </Grid>
            </Grid>
          )}

          <SeasonBanner />

          {bundleCatalog && bundleCatalog.items.length > 0 && (
            <Box>
              <EventCardGrid
                title="Paquetes"
                eventCards={bundleCatalog.items.map((item) =>
                  mapEventCatalogItemToCardVM(item),
                )}
                sizeVariant="lg"
                styleVariant="muted"
                showCardBadge={false}
                showAllButton={false}
              />
            </Box>
          )}
        </Box>
      </main>
      <div className="whatsappBubble">
        <a
          rel="noreferrer"
          href="https://api.whatsapp.com/send?phone=526646933586"
          target="_blank"
          style={{ position: "absolute", bottom: 0 }}
        >
          <Image
            loading="lazy"
            width="60"
            height="60"
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/whatsapp.svg`}
            alt="PWR Ticket - Whatsapp"
          />
        </a>
      </div>
    </div>
  );
}
