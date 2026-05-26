import { Box, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";

import { whiteLabel } from "@/config/whiteLabel";
import { colors } from "@/theme/colors";

import LegalTableOfContents from "./LegalTableOfContents";
import TermsAndConditionsContent from "./TermsAndConditionsContent";

export const metadata: Metadata = {
  title: `Información legal | ${whiteLabel.brandName}`,
  description: `Información legal, términos, privacidad, entrega y reembolsos de ${whiteLabel.brandName}.`,
  robots: "index, follow",
};

const companyInfo = [
  { label: "Razón social", value: whiteLabel.legalEntityName },
  { label: "Contacto", value: whiteLabel.contact.name },
  { label: "Domicilio", value: whiteLabel.contact.address },
  { label: "Teléfono", value: whiteLabel.contact.phone },
  { label: "Correo electrónico", value: whiteLabel.contact.email },
  {
    href: whiteLabel.websiteUrl,
    label: "Sitio web",
    value: whiteLabel.websiteUrl,
  },
] as const;

const termsAndConditionsTitle = "Términos y Condiciones";
const legalPageLinks = [
  { label: "Términos y condiciones", href: "#terminos" },
  { label: "Entrega de boletos", href: "#entrega" },
  { label: "Cancelaciones y reembolsos", href: "#reembolsos" },
  { label: "Privacidad", href: "#privacidad" },
] as const;

export default function LegalPage() {
  return (
    <Box component="main" mt={20} mb={8}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h2" color="primary" mb={1}>
            Información legal
          </Typography>
        </Box>

        <Grid container columns={12} spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, lg: 3 }} order={{ xs: 2, lg: 1 }}>
            <Paper
              component="section"
              id="contacto"
              elevation={3}
              className="paperCard"
              sx={{
                backgroundColor: colors.brand.white,
                scrollMarginTop: "120px",
              }}
            >
              <Typography variant="h4" color="primary" mb={3}>
                Información de la empresa
              </Typography>
              <Stack spacing={2}>
                {companyInfo.map((item) => (
                  <Box key={item.label}>
                    <Typography display="block" variant="caption" color="muted">
                      {item.label}
                    </Typography>
                    {"href" in item ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        color="secondary"
                        underline="hover"
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <Typography variant="body1" color="secondary">
                        {item.value}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }} order={{ xs: 3, lg: 2 }}>
            <Paper
              component="section"
              aria-labelledby="terminos"
              elevation={3}
              className="paperCard"
              sx={{
                backgroundColor: colors.brand.white,
                color: colors.text.primary,
                "& #terminos, & #entrega, & #reembolsos, & #privacidad": {
                  scrollMarginTop: "120px",
                },
                "& p": {
                  lineHeight: 1.7,
                  mb: 2,
                  mt: 0,
                },
                "& ol, & ul": {
                  mb: 2,
                  pl: 3,
                },
                "& li": {
                  mb: 1,
                },
                "& a": {
                  color: colors.brand.primary,
                },
              }}
            >
              <TermsAndConditionsContent whiteLabel={whiteLabel} />
            </Paper>
          </Grid>

          <Grid
            size={{ xs: 12, lg: 3 }}
            order={{ xs: 1, lg: 3 }}
            sx={{
              alignSelf: { lg: "flex-start" },
              position: { lg: "sticky" },
              top: { lg: 110 },
              zIndex: 1,
            }}
          >
            <Box>
              <Typography variant="h4" color="primary" mb={2}>
                {termsAndConditionsTitle}
              </Typography>

              <LegalTableOfContents links={legalPageLinks} />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
