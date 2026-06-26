"use client";
import { ArrowDownwardOutlined } from "@mui/icons-material";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { formatDate } from "@/helpers/formatDateHelper";
import { AgeRestrictionLabels } from "@/models/enums/age-restriction.enum";
import {
  EventDetailDTO,
  getEventDetailGalleryUrls,
  getEventDetailImageUrl,
  getEventDetailSponsorUrls,
} from "@/models/event-detail.dto";
import { getEventDetail } from "@/services/eventService";
import { colors } from "@/theme/colors";

interface EventClientWrapperProps {
  eventId: number;
}

export default function EventClientWrapper({
  eventId,
}: EventClientWrapperProps) {
  const router = useRouter();
  const [event, setEvent] = useState<EventDetailDTO | null>(null);
  const [ageRestriction, setAgeRestriction] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const eventRequest = await getEventDetail(eventId);
      setEvent(eventRequest);

      if (eventRequest.ageRestriction) {
        setAgeRestriction(AgeRestrictionLabels[eventRequest.ageRestriction]);
      }
    }
    load();
  }, []);

  const handleSeasonRenovate = (scheduleId: number) => {
    router.push(`/booking/${scheduleId}`);
  };

  const detailImage = event ? getEventDetailImageUrl(event) : "";
  const galleryImages = event ? getEventDetailGalleryUrls(event) : [];
  const sponsorImages = event ? getEventDetailSponsorUrls(event) : [];

  const Gallery = (
    <>
      {event && (
        <>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              width: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
            }}
            mb={3}
          >
            <Chip
              label={event.categories[0].displayName}
              color={"secondary"}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                maxWidth: "100%",
                fontWeight: 400,
                fontSize: 22,
                color: "white",
                borderRadius: 1,
                height: 45,
                paddingLeft: 4,
                paddingRight: 4,
                zIndex: 1,
                "& .MuiChip-label": {
                  fontSize: 20,
                  fontWeight: 400,
                  color: colors.text.primary,
                },
              }}
            />
            <Image
              src={detailImage}
              alt="Evento"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: 10,
              }}
            />
          </Box>
          <Typography variant="h4" mt={4}>
            Galería
          </Typography>
          <Grid container columns={2} spacing={2} mt={1.2}>
            {galleryImages.map((image, index) => (
              <Grid size={{ xs: 2, sm: 1, md: 2, lg: 1 }} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    overflow: "hidden",
                  }}
                  mb={3}
                >
                  <Image
                    src={image}
                    alt="Evento"
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      borderRadius: 10,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          {sponsorImages.length > 0 && (
            <>
              <Typography variant="h4" mt={2}>
                Patrocinadores
              </Typography>
              <Grid container columns={4} spacing={2} mt={1.2}>
                {sponsorImages.map((image, index) => (
                  <Grid size={{ xs: 2, sm: 1, md: 2, lg: 1 }} key={index}>
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        aspectRatio: "16 / 9",
                        overflow: "hidden",
                      }}
                      mb={3}
                    >
                      <Image
                        src={image}
                        alt="Patrocinador"
                        fill
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                          borderRadius: 10,
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <Box>
      {event && (
        <Box>
          <Grid
            container
            columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 18 }}
            mt={{ xs: 3, sm: 4, md: 5 }}
            spacing={{ xs: 0, sm: 0, md: 3, lg: 3, xl: 20 }}
          >
            <Grid
              size={{ xs: 10, sm: 10, md: 6, lg: 5, xl: 8 }}
              offset={{ xs: 1, sm: 1, md: 0 }}
            >
              <Typography
                variant="h1"
                color="primary"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {event.name}
                <LaunchRoudedIcon
                  color="neutral"
                  fontSize="large"
                  sx={{ marginLeft: 1, marginRight: 1 }}
                />
                <FavoriteButton eventId={event.id} colorBorder="neutral" />
              </Typography>
              <Typography
                variant="h5"
                fontWeight={400}
                mb={1}
                mt={3}
                color="primary"
              >
                Información
              </Typography>
              <Typography variant="subtitle1" mb={4} color="neutral">
                {event.longDescription}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={400}
                mb={1}
                mt={3}
                color="primary"
              >
                Dirección del recinto
              </Typography>
              <Typography variant="subtitle1" mb={4} color="neutral">
                {event.fullAddress}
              </Typography>

              <Box sx={{ display: { sm: "block", md: "none" } }} mt={4}>
                {Gallery}
              </Box>

              <Paper
                elevation={3}
                className="paperCard"
                sx={{ mt: { xs: 0, sm: 0, md: 6 }, mb: 6 }}
              >
                <Typography variant="h4" color="primary">
                  Boletos
                </Typography>
                <Divider
                  sx={{
                    mt: 2,
                    borderWidth: 1,
                    borderColor: "var(--color-border-muted)",
                  }}
                />
                {event.schedules.map((s) => (
                  <Accordion
                    key={s.id}
                    elevation={0}
                    defaultExpanded={event.schedules.length === 1}
                    sx={{ backgroundColor: colors.brand.white }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                        >
                          <Button
                            variant="outlined"
                            size="medium"
                            component="div"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeasonRenovate(s.id);
                            }}
                          >
                            Ver tickets
                          </Button>
                          <Box display="flex" flexDirection="row" mt={1}>
                            <ArrowDownwardOutlined
                              className="arrowIcon"
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body1" color="text">
                              Secciones
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        "& .MuiAccordionSummary-expandIconWrapper": {
                          transform: "none",
                        },
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded":
                          {
                            transform: "none",
                          },

                        "& .MuiAccordionSummary-expandIconWrapper .arrowIcon": {
                          transition: "transform 0.3s ease",
                        },
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded .arrowIcon":
                          {
                            transform: "rotate(180deg)",
                          },
                      }}
                    >
                      <Grid
                        container
                        columns={6}
                        my={2}
                        sx={{ width: "100%" }}
                        spacing={{ xs: 0, lg: 1 }}
                      >
                        <Grid size={{ xs: 6, sm: 3, md: 3, lg: 2 }}>
                          <Typography variant="body1" color="primary">
                            Fecha
                          </Typography>
                          <Typography
                            variant="body1"
                            color="secondary"
                            fontWeight={400}
                          >
                            {formatDate(s.date, "date")}
                          </Typography>
                        </Grid>
                        <Grid
                          size={{ xs: 6, sm: 3, md: 3, lg: 2 }}
                          alignContent="start"
                          my={{ xs: 1, sm: 0 }}
                        >
                          <Typography variant="body1" color="primary">
                            Hora
                          </Typography>
                          <Typography
                            variant="body1"
                            color="secondary"
                            fontWeight={400}
                          >
                            {formatDate(s.date, "time")}
                          </Typography>
                        </Grid>
                        <Grid
                          size={{ xs: 6, sm: 2, md: 2 }}
                          alignContent="start"
                          mt={{ xs: 0, sm: 1 }}
                        >
                          <Typography variant="body1" color="primary">
                            Estadio
                          </Typography>
                          <Typography
                            variant="body1"
                            color="secondary"
                            fontWeight={400}
                          >
                            {s.location}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Divider sx={{ mb: 2, borderWidth: 1 }} />
                      <Grid container columns={2} px={8}>
                        <Grid size={1}>
                          <Typography variant="body1" color="primary">
                            Sección
                          </Typography>
                        </Grid>
                        <Grid size={1}>
                          <Typography
                            variant="body1"
                            color="primary"
                            textAlign="right"
                          >
                            Precio
                          </Typography>
                        </Grid>
                      </Grid>
                      {s.sectionPrices &&
                        s.sectionPrices.length > 0 &&
                        s.sectionPrices.map((section, index) => (
                          <Box key={index}>
                            <Grid container columns={2} px={8}>
                              <Grid size={1}>
                                <Typography variant="body1" color="secondary">
                                  {section.objects.join(", ")}
                                </Typography>
                              </Grid>
                              <Grid size={1}>
                                <Typography
                                  variant="body1"
                                  color="secondary"
                                  textAlign="right"
                                >
                                  {formatCurrency(
                                    section.price ?? 0,
                                    section.currency,
                                  )}
                                </Typography>
                              </Grid>
                            </Grid>
                            {index < s.sectionPrices.length - 1 && (
                              <Divider sx={{ my: 1, borderWidth: 1 }} />
                            )}
                          </Box>
                        ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>

              {ageRestriction && (
                <Box mb={3}>
                  <Typography variant="h5" mb={1} mt={3} color="primary">
                    Restricciones de edad
                  </Typography>
                  <Typography variant="subtitle1" mb={4} color="secondary">
                    {ageRestriction}
                  </Typography>
                </Box>
              )}

              {event.securityPolicies && (
                <Box mb={3}>
                  <Typography variant="h5" mb={1} mt={3} color="primary">
                    Políticas de seguridad
                  </Typography>
                  <Typography variant="subtitle1" mb={4} color="secondary">
                    {event.securityPolicies}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid
              size={{ md: 6, lg: 7, xl: 10 }}
              mb={4}
              sx={{ display: { xs: "none", sm: "none", md: "block" } }}
            >
              {Gallery}
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
