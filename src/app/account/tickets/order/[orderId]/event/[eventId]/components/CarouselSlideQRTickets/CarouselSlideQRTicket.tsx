"use client";

import { AttachMoneyOutlined, LinkOff, Share } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, LinearProgress, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useState } from "react";

import { formatDate } from "@/helpers/formatDateHelper";
import { useQrTimer } from "@/hooks/useQrTimer";

import styles from "./CarouselSlideQRTicket.module.scss";
import { CarouselSlideQRTicketProps } from "./CarouselSlideQRTicket.type";

export default function CarouselSlideQRTicket({ ticket, isActive, onShare, onUnshare }: CarouselSlideQRTicketProps) {
    const [payload, setPayload] = useState("");
    const shouldGenerateQR = isActive && !(ticket.isOwner && ticket.isShared);

    const handleGenerate = useCallback((value: string) => {
        setPayload(value);
    }, []);

    const { secondsRemaining, progressPercent } = useQrTimer({
        isActive: shouldGenerateQR,
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
                    </CardContent>
                </Box>
                <Box className={styles.cardInfo} mt={2} mb={1}>
                    <Typography variant="subtitle1" fontWeight={700} color="primary">
                        {ticket.name}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700}>
                        {formattedDate}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={400}>
                        {ticket.location}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={400}>
                        {`Sección ${ticket.section}`}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={400}>
                        {`Fila ${ticket.row}, Asiento ${ticket.seat}`}
                    </Typography>
                </Box>
                <Box sx={{ backgroundColor: "white", justifySelf: "center" }} mt={3} mb={2}>
                    <Box textAlign="center" sx={{ position: "relative" }}>
                        {(ticket.isOwner && ticket.isShared) &&
                            <Box sx={{
                                backgroundColor: "red",
                                position: "absolute",
                                width: "100%",
                                top: "43%",
                                textAlign: "center",
                                py: 1
                            }}>
                                <Typography variant="body1" color="neutral" fontWeight={700}>
                                    Compartido
                                </Typography>
                            </Box>
                        }
                        <QRCodeSVG value={payload} size={200} level="L" />
                    </Box>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Box display="block" sx={{ width: "100%" }}>
                            {shouldGenerateQR &&
                                <Box sx={{ width: '100%', textAlign: 'center' }}>
                                    <Typography variant="inherit" mb={1}>
                                        {secondsRemaining}s
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPercent}
                                    />
                                </Box>
                            }

                            <Box display="flex" flexDirection="row" justifyContent="space-around" mt={3}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <IconButton
                                        aria-label="Vender"
                                        color="primary"
                                    >
                                        <AttachMoneyOutlined sx={{ fontSize: 30 }} />
                                    </IconButton>
                                    <Typography variant="bodyXs">
                                        Vender
                                    </Typography>
                                </Box>

                                {ticket.canShare &&
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <IconButton
                                            aria-label="Compartir"
                                            color="primary"
                                            onClick={() => onShare(ticket.id)}
                                        >
                                            <Share sx={{ fontSize: 30 }} />
                                        </IconButton>
                                        <Typography variant="bodyXs">
                                            Compartir
                                        </Typography>
                                    </Box>
                                }
                                {(ticket.isOwner && ticket.isShared) &&
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <IconButton
                                            aria-label="Dejar de compartir"
                                            color="primary"
                                            onClick={() => onUnshare(ticket.id)}
                                        >
                                            <LinkOff sx={{ fontSize: 30 }} />
                                        </IconButton>
                                        <Typography variant="bodyXs">
                                            Dejar de compartir
                                        </Typography>
                                    </Box>
                                }
                            </Box>
                        </Box>
                    </CardActions>
                </Box>
            </Box>
        </Card >
    );
}