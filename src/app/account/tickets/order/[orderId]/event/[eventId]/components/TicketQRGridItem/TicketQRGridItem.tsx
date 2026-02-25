"use client";

import { AttachMoneyOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Fade, IconButton, LinearProgress, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useState } from "react";

import { formatDate } from "@/helpers/formatDateHelper";
import { useQrTimer } from "@/hooks/useQrTimer";

import styles from "./TicketQRGridItem.module.scss";
import { TicketQRGridItemProps } from "./TicketQRGridItem.type";

export default function TicketQRGridItem({ ticket }: TicketQRGridItemProps) {
    const [showQR, setShowQR] = useState(false);
    const [payload, setPayload] = useState("");

    const handleGenerate = useCallback((value: string) => {
        setPayload(value);
    }, []);

    const { secondsRemaining, progressPercent } = useQrTimer({
        isActive: showQR,
        ticketId: ticket.id.toString(),
        onGenerate: handleGenerate
    });

    const formattedDate = formatDate(ticket.startDate, "monthYear");

    return (
        <Card variant="outlined" className={styles.card}>
            <Box position="relative">
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
                        <QRCodeSVG value={payload} size={260} level="L" />
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", width: '100%', textAlign: 'center' }} mt={1}>
                                <Typography variant="inherit" mb={1}>
                                    {secondsRemaining}s
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progressPercent}
                                />
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