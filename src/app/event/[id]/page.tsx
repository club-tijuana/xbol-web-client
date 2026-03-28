import { ArrowDownwardOutlined, StarBorder } from "@mui/icons-material";
import LaunchRoudedIcon from "@mui/icons-material/LaunchRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { formatDate } from "@/helpers/formatDateHelper";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getEventDetail, getTrendingEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import VisitorRegister from "../components/VisitorRegister/VisitorRegister";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import EventClientWrapper from "./components/EventClientWrapper/EventClientWrapper";

// const getEventCached = cache(getEventDetail);

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//   const { id } = await params;

//   if (!id) {
//     return {
//       title: "Evento | PWRTicket",
//       description: "Consulta los detalles de este evento.",
//       robots: "noindex, follow",
//     };
//   }
//   debugger;
//   const event = await getEventCached(Number(id));

//   return buildSeoMetadata({
//     title: `${event.name} | Boletos y fechas`,
//     description: event.longDescription?.slice(0, 155) ?? "Detalles del evento",
//     url: `https://dev.com/eventos/${event.id}`,
//     image: event.gallery?.[0] ?? "/og-default.jpg",
//     type: "article",
//   });
// }

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;

  // TODO: Create service to get other events
  const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
  const trendingEventsVM = trendingEvents.items.map(mapEventToCardVM);

  return (
    <Box>
      <VisitorRegister eventId={Number(id)} />
      <EventClientWrapper eventId={Number(id)} />
      <FullWidthSection
        variant="color"
        backgroundColor={colors.brand.background}
      >
        <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 20 } }} my={5}>
          <FAQ />
        </Box>
      </FullWidthSection>
      <Grid
        container
        columns={{ xs: 1, sm: 1, md: 2 }}
        spacing={5}
        mt={5}
        mb={4}
      >
        <Grid size={1}>
          <Advertisement image="/assets/images/advertisement/advertisement.png" />
        </Grid>
        <Grid size={1}>
          <Typography variant="h2" fontWeight={400} color="primary">
            Otros eventos
          </Typography>
          <EventCardGrid
            eventCards={trendingEventsVM}
            showCardActions={false}
            sizeVariant="xs"
            styleVariant="default"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
