"use client";

import { AttachMoneyOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Fade, IconButton, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import styles from "./TicketQRCard.module.scss";
import { TicketQRCardProps } from "./TicketQRCard.type";

export default function TicketQRCard({ ticket }: TicketQRCardProps) {
    const TOTAL_TIME = 30000;
    const INTERVAL = 100;

    const [showQR, setShowQR] = useState(false);
    const [progress, setProgress] = useState(0);
    const [seconds, setSeconds] = useState(TOTAL_TIME / 1000);

    useEffect(() => {
        if (!showQR) return;

        let startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(TOTAL_TIME - elapsed, 0);

            const percent = 100 - (remaining / TOTAL_TIME) * 100;
            setProgress(percent);
            setSeconds(Math.ceil(remaining / 1000));

            if (remaining === 100) {
                startTime = Date.now();
                setProgress(0);
                setSeconds(TOTAL_TIME / 1000);
            }
        }, INTERVAL);

        return () => clearInterval(timer);
    }, [showQR]);

    const formattedDate = Intl.DateTimeFormat("es-MX", {
        month: 'long',
        year: 'numeric'
    }).format(new Date(ticket.startDate));

    return (
        <Card variant="outlined" className={styles.card}>
            <Box position="relative">
                {/* Wrapper para el contenido */}
                <Fade in={!showQR} mountOnEnter unmountOnExit timeout={300}>
                    <Box
                        sx={{
                            position: showQR ? "absolute" : "relative",
                            inset: 0,
                        }}
                    >
                        <CardContent className={styles.cardContent}>
                            <CardMedia
                                component="img"
                                image={ticket.eventImage}
                                alt="title"
                                sx={{ display: 'block', borderRadius: 2.5, height: '100%', width: '100%', objectFit: 'cover' }}
                            />

                            <Box className={styles.cardInfo}>
                                <Typography variant="subtitle1" fontWeight={700} color="primary">
                                    {ticket.name}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={700} color="neutral">
                                    {formattedDate}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={400} color="neutral">
                                    {ticket.location}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={400} color="neutral">
                                    {'ID: ' + ticket.id}
                                </Typography>
                                <CardActions sx={{ justifyContent: "center" }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <IconButton
                                            aria-label="Ver"
                                            color="primary"
                                            onClick={() => setShowQR(true)}
                                        >
                                            <VisibilityOutlined sx={{ fontSize: 30 }} />
                                        </IconButton>
                                        <Typography variant="bodyXs" color="neutral">
                                            Ver
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <IconButton
                                            aria-label="Vender"
                                            color="primary"
                                        >
                                            <AttachMoneyOutlined sx={{ fontSize: 30 }} />
                                        </IconButton>
                                        <Typography variant="bodyXs" color="neutral">
                                            Vender
                                        </Typography>
                                    </Box>
                                </CardActions>
                            </Box>

                            <Box className={styles.overlay} />
                        </CardContent>
                    </Box>
                </Fade>

                <Fade in={showQR} mountOnEnter unmountOnExit timeout={300}>
                    <Box
                        sx={{
                            position: showQR ? "relative" : "absolute",
                            inset: 0,
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={ticket.qr}
                            alt="QR"
                        />
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", width: '100%', textAlign: 'center' }} mt={1}>
                                <Typography variant="inherit" mb={1}>
                                    {seconds}s
                                </Typography>
                                <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} />
                                <Button variant="text" sx={{ mt: 1 }} onClick={() => setShowQR(false)}>
                                    Ocultar
                                </Button>
                            </Box>
                        </CardActions>
                    </Box>
                </Fade>
            </Box>
        </Card>
    );
}