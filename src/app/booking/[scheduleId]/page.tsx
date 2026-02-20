import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

import SeatsMap from "@/components/SeatsMap/SeatsMap";
import { getEventItemBySchedule } from "@/services/bookingService";

import SeatSelection from "./components/SeatSelection/SeatSelection";

interface PageProps {
  params: Promise<{
    scheduleId: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { scheduleId } = await params;

  const event = await getEventItemBySchedule(Number(scheduleId));

  const formattedDate = Intl.DateTimeFormat("es-MX", {
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    hour12: true
  }).format(new Date(event.startDate));

  return (
    <Grid container columns={12} mt={7}>
      <Grid size={6}>
        <Grid container columns={12}>
          <Grid size={4}>
            <Box sx={{
              position: "relative",
              height: 126
            }}>
              <Image
                src={event.posterImageUrl}
                alt="Evento"
                fill
                style={{ objectFit: 'cover', borderRadius: 10 }}
              />
            </Box>
          </Grid>
          <Grid size={7} display={"flex"} flexDirection={"column"} pl={4}>
            <Typography variant="hero" color="primary">
              {event.name}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={400}
              color="text"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <CalendarTodayOutlined color="primary" />
              {formattedDate}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={400}
              color="text"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <LocationOnOutlined color="primary" />
              {event.location}
            </Typography>
          </Grid>
        </Grid>
        <SeatSelection scheduleId={Number(scheduleId)} />
      </Grid>
      <Grid size={6}>
        {event && event.eventKey &&
          <SeatsMap
            eventKey={event.eventKey}
          />
        }
      </Grid>
    </Grid>
  );
}
