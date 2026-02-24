"use client";

import { Box, Card, CardActions, CardContent, CardMedia, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import styles from "./TicketQRCard.module.scss";
import { TicketQRCardProps } from "./TicketQRCard.type";

export default function TicketQRCard({ ticket }: TicketQRCardProps) {
    const TOTAL_TIME = 30000;
    const INTERVAL = 100;

    const [progress, setProgress] = useState(0);
    const [seconds, setSeconds] = useState(TOTAL_TIME / 1000);

    useEffect(() => {
        let startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(TOTAL_TIME - elapsed, 0);

            const percent = 100 - (remaining / TOTAL_TIME) * 100;
            setProgress(percent);
            setSeconds(Math.ceil(remaining / 1000));

            if (remaining <= 0) {
                startTime = Date.now();
                setProgress(0);
                setSeconds(TOTAL_TIME / 1000);
            }
        }, INTERVAL);

        return () => clearInterval(timer);
    }, []);

    const formattedDate = Intl.DateTimeFormat("es-MX", {
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        hour12: true
    }).format(new Date(ticket.startDate));

    return (
        <Card variant="outlined" className={styles.card}>
            <Box position="relative">
                <Box>
                    <CardContent className={styles.cardContent}>
                        <CardMedia
                            component="img"
                            image={ticket.eventImage}
                            alt="title"
                            sx={{
                                display: 'block',
                                borderRadius: 2.5,
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover'
                            }}
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
                                {`Sección ${ticket.section}`}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={400} color="neutral">
                                {`Fila ${ticket.row}, Asiento ${ticket.seat}`}
                            </Typography>
                        </Box>

                        <Box className={styles.overlay} />
                    </CardContent>
                </Box>
                <Box sx={{ backgroundColor: "white" }}>
                    <CardMedia
                        component="img"
                        image={ticket.qr}
                        alt="QR"
                        sx={{ px: 8 }}
                    />
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", width: '100%', textAlign: 'center' }} mb={2}>
                            <Typography variant="inherit" mb={1}>
                                {seconds}s
                            </Typography>
                            <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} />
                        </Box>
                    </CardActions>
                </Box>
            </Box>
        </Card>
    );
}