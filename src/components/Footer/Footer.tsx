import { Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { colors } from "@/theme/colors";
import appStoreIcon from "@public/assets/icons/app-store.svg";
import facebookIcon from "@public/assets/icons/facebook-icon.svg";
import googlePlayIcon from "@public/assets/icons/google-play.svg";
import instagramIcon from "@public/assets/icons/instagram-icon.svg";
import xIcon from "@public/assets/icons/x-icon.svg";
import youtubeIcon from "@public/assets/icons/youtube-icon.svg";
import logo from "@public/assets/logo.svg";

import styles from "./Footer.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Grid container columns={12}>
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 4 }} className={styles.logoContainer}>
                    <div className={styles.logoContainer}>
                        <Image
                            src={logo}
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
                                <Typography variant="body1" color={colors.light.neutral}>Eventos</Typography>
                                <Typography variant="body1" color={colors.light.neutral}>Teatro</Typography>
                                <Typography variant="body1" color={colors.light.neutral}>Música</Typography>
                            </Stack>
                        </Grid>
                        <Grid size={6} display="flex" justifyContent="center">
                            <Stack spacing={1} className={styles.stack}>
                                <Typography variant="body1" color={colors.light.neutral}>Deporte</Typography>
                                <Typography variant="body1" color={colors.light.neutral}>Centro de ayuda</Typography>
                                <Typography variant="body1" color={colors.light.neutral}>Quienes somos</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                    <Grid container columns={12}>
                        <Grid size={12} >
                            <div className={styles.iconContainer}>
                                <Image
                                    src={facebookIcon}
                                    alt="Facebook"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src={xIcon}
                                    alt="X"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src={instagramIcon}
                                    alt="Instagram"
                                    width={23}
                                    height={23}
                                />
                                <Image
                                    src={youtubeIcon}
                                    alt="YouTube"
                                    width={23}
                                    height={23}
                                />
                            </div>
                        </Grid>
                        <Grid size={12} >
                            <div className={styles.downloadContainer}>
                                <Image
                                    src={googlePlayIcon}
                                    alt="YouTube"
                                    width={145}
                                    height={43}
                                />
                                <Image
                                    src={appStoreIcon}
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