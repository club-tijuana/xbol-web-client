"use client";
import { Grid, Stack, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { colors } from "@/theme/colors";

import styles from "./Footer.module.scss";

const legalLinks = [
  { label: "Información de la empresa", href: "/legal#contacto" },
  { label: "Términos y condiciones", href: "/legal#terminos" },
  { label: "Entrega de boletos", href: "/legal#entrega" },
  { label: "Cancelaciones y reembolsos", href: "/legal#reembolsos" },
  { label: "Privacidad", href: "/legal#privacidad" },
] as const;

export default function Footer() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <footer className={styles.footer}>
      <Grid container columns={12}>
        <Grid
          size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}
          sx={{
            mb: {
              xs: 3,
              sm: 0,
            },
          }}
          className={styles.logoContainer}
        >
          <div className={styles.logoContainer}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/logo.svg`}
              alt="Logo"
              className={styles.cursorPointer}
              objectFit="cover"
              width={231}
              height={54}
              onClick={handleGoHome}
            />
          </div>
        </Grid>
        <Grid
          sx={{
            mr: {
              lg: "auto",
            },
            mt: { xs: 2, sm: 0 },
            textAlign: {
              lg: "left",
            },
            alignContent: {
              xs: "center",
            },
            display: "flex",
            justifyContent: {
              xs: "center",
              lg: "center",
            },
          }}
          size={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}
        >
          <Stack spacing={1} className={styles.stack}>
            <Tooltip title="Próximamente">
              <Typography variant="body1" color={colors.text.neutral}>
                Eventos
              </Typography>
            </Tooltip>
            <Tooltip title="Próximamente">
              <Typography variant="body1" color={colors.text.neutral}>
                Teatro
              </Typography>
            </Tooltip>
            <Tooltip title="Próximamente">
              <Typography variant="body1" color={colors.text.neutral}>
                Música
              </Typography>
            </Tooltip>
            <Tooltip title="Próximamente">
              <Typography variant="body1" color={colors.text.neutral}>
                Deporte
              </Typography>
            </Tooltip>
            <Tooltip title="Próximamente">
              <Typography variant="body1" color={colors.text.neutral}>
                Centro de ayuda
              </Typography>
            </Tooltip>
            <Tooltip title="Próximamente">
              <Typography variant="body1" color={colors.text.neutral}>
                Quienes somos
              </Typography>
            </Tooltip>
          </Stack>
        </Grid>

        <Grid
          sx={{
            mt: { xs: 2, sm: 0 },

            alignContent: {
              xs: "center",
            },
          }}
          size={{ xs: 6, sm: 6, md: 4, lg: 3, xl: 3 }}
          display="flex"
          justifyContent="center"
        >
          <Stack spacing={1} className={styles.stack}>
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.footerLink}
              >
                <Typography variant="body1" color={colors.text.neutral}>
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Stack>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 12, lg: 3, xl: 3 }}
          sx={{
            mt: { xs: 2, sm: 2, md: 4 },
          }}
        >
          <Grid container columns={12}>
            <Grid size={12}>
              <div className={styles.iconContainer}>
                <Link
                  href="https://www.facebook.com/profile.php?id=61590497022782"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/facebook-icon.svg`}
                    alt="Facebook"
                    width={23}
                    height={23}
                    style={{ marginRight: "70px" }}
                  />
                </Link>

                <Link
                  href="https://x.com/PwrTicketMX"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/x-icon.svg`}
                    alt="X"
                    width={23}
                    height={23}
                    style={{ marginRight: "70px" }}
                  />
                </Link>

                <Link
                  href="https://www.instagram.com/pwrticket/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/instagram-icon.svg`}
                    alt="Instagram"
                    width={23}
                    height={23}
                    style={{ marginRight: "70px" }}
                  />
                </Link>

                <Tooltip title="Próximamente">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/youtube-icon.svg`}
                    alt="YouTube"
                    width={23}
                    height={23}
                  />
                </Tooltip>
              </div>
            </Grid>
            <Grid size={12}>
              <div className={styles.downloadContainer}>
                <Tooltip title="Próximamente">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/google-play.svg`}
                    alt="YouTube"
                    width={145}
                    height={43}
                  />
                </Tooltip>

                <Tooltip title="Próximamente">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/app-store.svg`}
                    alt="YouTube"
                    width={145}
                    height={43}
                  />
                </Tooltip>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </footer>
  );
}
