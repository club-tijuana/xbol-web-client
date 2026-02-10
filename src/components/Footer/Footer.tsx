import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { colors } from "@/theme/colors";

import styles from "./Footer.module.scss";

export default function Footer() {
    const links = [
        "Política de Compra",
        "Aviso de Privacidad",
        "Política de Cookies",
        "Administrar mis cookies",
    ];

    return (
        <footer className={styles.footer}>
            <Grid container columns={12} pt={11} pb={6}>
                <Grid size={3}>
                    <div className={styles.logoContainer}>
                        <Image
                            src="/assets/logo.png"
                            alt="Logo"
                            objectFit="contain"
                            width={231}
                            height={54}
                        />
                    </div>
                </Grid>
                <Grid size={2} display="flex" justifyContent="flex-end">
                    <Stack spacing={1} mr={9}>
                        <Typography variant="body1" color={colors.light.neutral}>Eventos</Typography>
                        <Typography variant="body1" color={colors.light.neutral}>Teatro</Typography>
                        <Typography variant="body1" color={colors.light.neutral}>Música</Typography>
                    </Stack>
                </Grid>
                <Grid size={2} display="flex" justifyContent="flex-start">
                    <Stack spacing={1} ml={9}>
                        <Typography variant="body1" color={colors.light.neutral}>Deporte</Typography>
                        <Typography variant="body1" color={colors.light.neutral}>Centro de ayuda</Typography>
                        <Typography variant="body1" color={colors.light.neutral}>Quienes somos</Typography>
                    </Stack>
                </Grid>
                <Grid size={3} px={6}>
                    <Grid container columns={4}>
                        <Grid size={4}>
                            <div className={styles.iconContainer}>
                                <Image
                                    src="/assets/icons/facebook-icon.svg"
                                    alt="Facebook"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src="/assets/icons/x-icon.svg"
                                    alt="X"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src="/assets/icons/instagram-icon.svg"
                                    alt="Instagram"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src="/assets/icons/youtube-icon.svg"
                                    alt="YouTube"
                                    width={23}
                                    height={23}
                                />
                            </div>
                        </Grid>
                        <Grid size={4} mt={4}>
                            <div className={styles.downloadContainer}>
                                <Image
                                    src="/assets/icons/google-play.svg"
                                    alt="YouTube"
                                    width={145}
                                    height={43}
                                />
                                <Image
                                    src="/assets/icons/app-store.svg"
                                    alt="YouTube"
                                    width={145}
                                    height={43}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box
                sx={{
                    backgroundColor: "var(--color-bg-footer-badge)",
                    textAlign: "center",
                    pt: 1.1,
                    pb: 0.7
                }}
            >
                <Stack
                    direction="row"
                    alignItems={'center'}
                    justifyContent="center"
                    color={colors.light.neutral}
                    divider={<Typography variant="caption">|</Typography>}
                >
                    {links.map((text) => (
                        <Button key={text} sx={{ textTransform: 'none' }}>
                            <Typography variant="caption" color={colors.light.neutral}>
                                {text}
                            </Typography>
                        </Button>
                    ))}
                </Stack>
            </Box>
        </footer>
    );
}