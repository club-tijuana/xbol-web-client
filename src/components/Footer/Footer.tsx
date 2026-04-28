import { Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { colors } from "@/theme/colors";

import styles from "./Footer.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Grid container columns={12}>
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 4 }} className={styles.logoContainer}>
                    <div className={styles.logoContainer}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/logo.svg`}
                            alt="Logo"
                            objectFit="contain"
                            width={231}
                            height={54}
                        />
                    </div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 5, lg: 5, xl: 4 }}>
                    <Grid container columns={12} className={styles.stackContainer}>
                        <Grid size={6} display="flex" justifyContent="center">
                            <Stack spacing={1} className={styles.stack}>
                                <Typography variant="body1" color={colors.text.neutral}>Eventos</Typography>
                                <Typography variant="body1" color={colors.text.neutral}>Teatro</Typography>
                                <Typography variant="body1" color={colors.text.neutral}>Música</Typography>
                            </Stack>
                        </Grid>
                        <Grid size={6} display="flex" justifyContent="center">
                            <Stack spacing={1} className={styles.stack}>
                                <Typography variant="body1" color={colors.text.neutral}>Deporte</Typography>
                                <Typography variant="body1" color={colors.text.neutral}>Centro de ayuda</Typography>
                                <Typography variant="body1" color={colors.text.neutral}>Quienes somos</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                    <Grid container columns={12}>
                        <Grid size={12} >
                            <div className={styles.iconContainer}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/facebook-icon.svg`}
                                    alt="Facebook"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/x-icon.svg`}
                                    alt="X"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/instagram-icon.svg`}
                                    alt="Instagram"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/youtube-icon.svg`}
                                    alt="YouTube"
                                    width={23}
                                    height={23}
                                />
                            </div>
                        </Grid>
                        <Grid size={12} >
                            <div className={styles.downloadContainer}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/google-play.svg`}
                                    alt="YouTube"
                                    width={145}
                                    height={43}
                                />
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/app-store.svg`}
                                    alt="YouTube"
                                    width={145}
                                    height={43}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        </footer >
    );
}