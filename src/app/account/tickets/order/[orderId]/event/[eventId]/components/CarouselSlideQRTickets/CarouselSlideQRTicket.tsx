"use client";

import { Box, Card, CardActions, CardContent, CardMedia, LinearProgress, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useState } from "react";

import { formatDate } from "@/helpers/formatDateHelper";
import { useQrTimer } from "@/hooks/useQrTimer";

import styles from "./CarouselSlideQRTicket.module.scss";
import { CarouselSlideQRTicketProps } from "./CarouselSlideQRTicket.type";

export default function CarouselSlideQRTicket({ ticket, isActive }: CarouselSlideQRTicketProps) {
    const [payload, setPayload] = useState("");

    const handleGenerate = useCallback((value: string) => {
        setPayload(value);
    }, []);

    const { secondsRemaining, progressPercent } = useQrTimer({
        isActive: isActive,
        ticketId: ticket.id.toString(),
        onGenerate: handleGenerate
    });

    const formattedDate = formatDate(ticket.startDate, "dateTime");

    return (
        <Card variant="elevation" className={styles.card}>
            <Box position="relative" sx={{ backgroundColor: 'white', display: 'grid' }}>
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
                <Box sx={{ backgroundColor: "white", justifySelf: "center" }} mt={3} mb={2}>
                    <QRCodeSVG value={payload} size={260} level="L" />
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography variant="inherit" mb={1}>
                                {secondsRemaining}s
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progressPercent}
                            />
                        </Box>
                    </CardActions>
                </Box>
            </Box>
        </Card >
    );
}