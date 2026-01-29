"use client";

import styles from "./Header.module.scss";
import { useDispatch } from "react-redux";
import { openLoginModal } from "@/store/slices/uiSlice";
import Image from "next/image";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/");
    }

    //TODO: Reemplazar por mui App Bar
    return (
        <header className={styles.header}>
            <Grid container columns={12} spacing={2} alignItems="center">
                <Grid size={3}>
                    <Box className={styles.logoContainer}>
                        <Image
                            src="/assets/logo.png"
                            alt="Logo"
                            fill
                            className={styles.logo}
                            onClick={handleGoHome}
                        />
                    </Box>
                </Grid>

                <Grid size={1}>
                </Grid>

                <Grid size={4}>
                    <nav className={styles.nav}>
                        <a>Futbol</a>
                        <a>Música</a>
                        <a>Teatro</a>
                        <a>Mercado secundario</a>
                    </nav>
                </Grid>

                <Grid size={1}>
                </Grid>

                <Grid size={3}>
                    <Tooltip title="Iniciar sesión">
                        <IconButton onClick={() => dispatch(openLoginModal())}>
                            <Image
                                src="/assets/icons/login.svg"
                                alt="Login"
                                width={28.32}
                                height={31.56}
                            />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </header>
    );
}