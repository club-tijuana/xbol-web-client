import { ArrowDownwardOutlined } from "@mui/icons-material";
import LaunchRoudedIcon from "@mui/icons-material/LaunchRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { convert } from "html-to-text";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import React from "react";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { formatDate } from "@/helpers/formatDateHelper";
import { AgeRestrictionLabels } from "@/models/enums/age-restriction.enum";
import {
  getEventDetailGalleryUrls,
  getEventDetailImageUrl,
} from "@/models/event-detail.dto";
import { eventImageOrDefault } from "@/models/event-image";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getEventDetail, getTrendingEvents } from "@/services/eventService";
import { colors } from "@/theme/colors";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import VisitorRegister from "../components/VisitorRegister/VisitorRegister";

import styles from "./page.module.scss";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

const seoDescription = (value?: string): string => {
  return convert(value ?? "", {
    wordwrap: false,
    selectors: [{ selector: "img", format: "skip" }],
  });
};

const getEventDetailCached = cache(async (id: number) => {
  return await getEventDetail(id);
});

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const idNumber = Number(id);

  const event = await getEventDetailCached(idNumber);

  return buildSeoMetadata({
    title: event.name,
    description: seoDescription(event.shortDescription),
    url: "",
    image: getEventDetailImageUrl(event),
    type: "website",
  });
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;
  const idNumber = Number(id);

  const event = await getEventDetailCached(idNumber);
  const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
  const trendingEventsVM = trendingEvents.items.map((e) =>
    mapEventToCardVM(e, "monthYear"),
  );

  const ageRestriction = event.ageRestriction
    ? AgeRestrictionLabels[event.ageRestriction]
    : "";
  const galleryUrls = getEventDetailGalleryUrls(event);

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
            {event && event.categories && event.categories.length > 0 && (
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
            )}
            <Image
              src={getEventDetailImageUrl(event)}
              alt="Evento"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: 10,
              }}
            />
          </Box>
          {galleryUrls.length > 0 && (
            <Box>
              <Typography variant="h4" mt={4}>
                Galería
              </Typography>
              <Grid container columns={2} spacing={2} mt={1.2}>
                {galleryUrls.map((image, index) => (
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
                        src={eventImageOrDefault(image)}
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
            </Box>
          )}
        </>
      )}
    </>
  );

  return (
    <Box>
      <VisitorRegister eventId={Number(id)} />

      <FullWidthSection
        variant="imageFixedHeight"
        image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/separators/soccer-separator.png`}
        height={630}
        bottomRounded={true}
      >
        <Box>
          {event && (
            <Box>
              <Grid
                container
                columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 18 }}
                mt={20}
                spacing={{ xs: 0, sm: 0, md: 3, lg: 3, xl: 20 }}
              >
                <Grid
                  size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 9 }}
                  offset={{ xs: 0, sm: 0, md: 0 }}
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
                  <Box
                    mb={4}
                    dangerouslySetInnerHTML={{
                      __html: event.longDescription ?? "",
                    }}
                    color={colors.text.neutral}
                    sx={{
                      color: colors.text.neutral,
                      "& *": {
                        color: "var(--color-white) !important",
                      },
                    }}
                  />

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
                    sx={{
                      mt: { xs: 0, sm: 0, md: 6 },
                      mb: 6,
                      px: { xs: 1, sm: 4, md: 2, lg: 4, xl: 4 },
                    }}
                  >
                    <Typography sx={{ px: 2 }} variant="h4" color="primary">
                      Tickets
                    </Typography>
                    <Divider
                      sx={{
                        mt: 2,
                        borderWidth: 0.8,
                        borderColor: "var(--color-border-muted)",
                      }}
                    />
                    {event.schedules.map((s) => (
                      <React.Fragment key={s.id}>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                            pt: 3,
                            pb: 0,
                            mb: 0,
                          }}
                        >
                          <Link
                            href={`/booking/${s.id}`}
                            className={styles.ticketsButton}
                          >
                            Ver tickets
                          </Link>
                        </Box>

                        <Accordion
                          key={s.id}
                          elevation={0}
                          defaultExpanded={event.schedules.length === 1}
                          sx={{
                            "&:before": {
                              display: "none",
                            },
                            "& .MuiAccordionSummary-content": {
                              margin: 0,
                            },
                            "&.Mui-expanded": {
                              margin: "0px !important",
                            },
                            backgroundColor: colors.brand.white,
                            pt: 0,
                            mt: 0,
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={1}
                              >
                                <Box display="flex" flexDirection="row" mt={1}>
                                  <ArrowDownwardOutlined
                                    className="arrowIcon"
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                  />
                                  <Typography variant="body1" color="text">
                                    Zonas
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{
                              paddingTop: 0,
                              marginTop: 0,

                              "& .MuiAccordionSummary-expandIconWrapper": {
                                transform: "none",
                              },
                              "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded":
                                {
                                  transform: "none",
                                },

                              "& .MuiAccordionSummary-expandIconWrapper .arrowIcon":
                                {
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
                                size={{ xs: 12, sm: 2, md: 12, lg: 12 }}
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
                            <Grid container columns={2}>
                              <Grid size={1}>
                                <Typography variant="body1" color="primary">
                                  Zona
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
                                  <Grid container columns={2} px={0}>
                                    <Grid size={1}>
                                      <Typography
                                        variant="body1"
                                        color="secondary"
                                      >
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
                            {s.sectionPrices && s.sectionPrices.length > 0 && (
                              <Typography
                                variant="body2"
                                color="secondary"
                                textAlign="center"
                                mt={2}
                              >
                                Los precios mostrados son finales e incluyen
                                impuestos y cargos aplicables.
                              </Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </React.Fragment>
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
                      <Box
                        mb={4}
                        dangerouslySetInnerHTML={{
                          __html: event.securityPolicies ?? "",
                        }}
                        color={colors.text.secondary}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid
                  size={{ md: 6, lg: 6, xl: 9 }}
                  mb={4}
                  sx={{ display: { xs: "none", sm: "none", md: "block" } }}
                >
                  {Gallery}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </FullWidthSection>

      <FullWidthSection
        variant="color"
        backgroundColor={colors.ui.surface}
        topRounded={true}
        bottomRounded={true}
      >
        <Box sx={{ px: { xs: 4, sm: 10, md: 10, lg: 20, xl: 20 } }} my={5}>
          <FAQ />
        </Box>
      </FullWidthSection>
      <Grid
        container
        columns={{ xs: 1, sm: 1, md: 2 }}
        spacing={2}
        mt={5}
        mb={4}
      >
        <Grid size={1}>
          <Advertisement
            image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/images/advertisement/advertisement.png`}
          />
        </Grid>
        <Grid size={1}>
          <Typography variant="h3" fontWeight={400} color="primary">
            Otros eventos
          </Typography>
          <EventCardGrid
            eventCards={trendingEventsVM}
            sizeVariant="xs"
            styleVariant="default"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
