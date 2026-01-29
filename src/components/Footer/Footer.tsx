import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";

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
                            fill
                            className={styles.logo}
                        />
                    </div>
                </Grid>
                <Grid size={2} display="flex" justifyContent="flex-end">
                    <Stack spacing={1} mr={9}>
                        <Typography variant="subtitle2" className="textWhite">Eventos</Typography>
                        <Typography variant="subtitle2" className="textWhite">Teatro</Typography>
                        <Typography variant="subtitle2" className="textWhite">Música</Typography>
                    </Stack>
                </Grid>
                <Grid size={2} display="flex" justifyContent="flex-start">
                    <Stack spacing={1} ml={9}>
                        <Typography variant="subtitle2" className="textWhite">Deporte</Typography>
                        <Typography variant="subtitle2" className="textWhite">Centro de ayuda</Typography>
                        <Typography variant="subtitle2" className="textWhite">Quienes somos</Typography>
                    </Stack>
                </Grid>
                <Grid size={2} px={6}>
                    <Grid container columns={4}>
                        <Grid size={4}>
                            <div className={styles.iconContainer}>
                                <Image
                                    src="/assets/icons/facebook-icon.png"
                                    alt="Facebook"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src="/assets/icons/x-icon.png"
                                    alt="X"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src="/assets/icons/instagram-icon.png"
                                    alt="Instagram"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src="/assets/icons/youtube-icon.png"
                                    alt="YouTube"
                                    width={23}
                                    height={23}
                                />
                            </div>
                        </Grid>
                        <Grid size={4} mt={4}>
                            <div className={styles.iconContainer}>
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
                    backgroundColor: "var(--color-text-primary)",
                    textAlign: "center",
                    pt: 3,
                    pb: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems={'center'}
                    justifyContent="center"
                    divider={<span className={`textWhite ${styles.linkButton}`}>|</span>}
                >
                    {links.map((text) => (
                        <Button key={text} variant="text" sx={{ textTransform: 'none' }} className={`textWhite ${styles.linkButton}`}>
                            {text}
                        </Button>
                    ))}
                </Stack>
            </Box>
        </footer>
    );
}