import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import EventCrousel from "@/components/EventCarousel/EventCarousel";
import { getEventsByCategory, getOutstandingEvents } from "@/services/eventService";
import { Box, Grid } from "@mui/material";

export default async function Home() {
  const outstandingEvents = await getOutstandingEvents();
  const futbolEvents = await getEventsByCategory(2, 4);
  const musicEvents = await getEventsByCategory(1, 3);
  const theaterEvents = await getEventsByCategory(3, 2);

  return (
    <div>
      <main>
        <Box
          sx={{
            width: "100vw",
            ml: "calc(50% - 50vw)",
            backgroundImage: "url('/assets/images/separators/soccer-separator.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflowX: "hidden",
          }}
        >
          <EventCrousel />
        </Box>

        <Grid container columns={12} mt={6}>
          <Grid size={9} offset={2}>
            <EventCardGrid
              title="Eventos destacados"
              titleAlign="center"
              eventCards={outstandingEvents} 
              columns={6} 
              itemSize={1} 
              spacing={5}
              size="sm" 
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            width: "100vw",
            ml: "calc(50% - 50vw)",
            backgroundImage: "url('/assets/images/separators/soccer-separator.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflowX: "hidden",
          }}
          mt={4}
        >
          <Box sx={{ maxWidth: "1800px", mx: "auto", px: 4, paddingBottom: 5, paddingTop: 5 }}>
            <EventCardGrid
              title="Fútbol"
              eventCards={futbolEvents}
              columns={4}
              itemSize={1}
              spacing={4}
              cardDescriptionClass="textWhite"
              cardDescriptionAlign="left"
              cardTitleAlign="left"
            />
          </Box>
          
        </Box>

        <Box mt={8}>
          <EventCardGrid 
            title="Música"
            eventCards={musicEvents}
            columns={4}
            itemSize={1}
            spacing={4}
            cardDescriptionClass="textMuted"
            cardDescriptionAlign="left"
            cardTitleAlign="left"
          />
        </Box>

        <Box
          sx={{
            width: "100vw",
            ml: "calc(50% - 50vw)",
            backgroundColor: 'var(--color-bg-muted)',
            overflowX: "hidden",
          }}
          mt={8}
        >
          <Box sx={{ maxWidth: "1800px", mx: "auto", px: 4, paddingBottom: 5, paddingTop: 5 }}>
            <EventCardGrid 
              title="Teatro"
              eventCards={theaterEvents}
              columns={4}
              itemSize={1}
              spacing={4}
              cardDescriptionClass="textMuted"
              cardDescriptionAlign="left"
              cardTitleAlign="left"
            />
          </Box>
        </Box>
      </main>
    </div>
  );
}
