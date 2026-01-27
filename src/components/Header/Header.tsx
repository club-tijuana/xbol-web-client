"use client";

import styles from "./Header.module.scss";
import { useDispatch } from "react-redux";
import { openLoginModal } from "@/store/slices/uiSlice";
import Image from "next/image";
import { Grid } from "@mui/material";

export default function Header() {
    const dispatch = useDispatch();

    return (
        <header className={styles.header}>
            <Grid container columns={12} spacing={2} alignItems="center">
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
                    <button
                        className={styles.btnLogin}
                        onClick={() => dispatch(openLoginModal())}
                    >
                        <img
                        src="/assets/icons/login.svg"
                        alt="Login"
                        width={28.32}
                        height={31.56}
                        />
                    </button>
                </Grid>
            </Grid>
        </header>
    );
}