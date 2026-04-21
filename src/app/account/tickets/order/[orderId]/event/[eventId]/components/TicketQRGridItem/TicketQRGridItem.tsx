"use client";

import { AttachMoneyOutlined, LinkOff, Share, VisibilityOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Fade, IconButton, LinearProgress, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useState } from "react";

import { formatDate } from "@/helpers/formatDateHelper";
import { useQrTimer } from "@/hooks/useQrTimer";

import styles from "./TicketQRGridItem.module.scss";
import { TicketQRGridItemProps } from "./TicketQRGridItem.type";

export default function TicketQRGridItem({ ticket, onShare, onUnshare }: TicketQRGridItemProps) {
    const [showQR, setShowQR] = useState(false);
    const [payload, setPayload] = useState("");
    const shouldGenerateQR = showQR && !(ticket.isOwner && ticket.isShared);

    const handleGenerate = useCallback((value: string) => {
        setPayload(value);
    }, []);

    const { secondsRemaining, progressPercent } = useQrTimer({
        isActive: shouldGenerateQR,
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
                                image={ticket.eventImage}
                                sx={{
                                    aspectRatio: "1 / 1",
                                    borderRadius: 2.5,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />

                            <Box className={styles.cardInfo} mt={2}>
                                <Typography variant="subtitle2">
                                    {ticket.name}
                                </Typography>
                                <Typography variant="body1" color="secondary">
                                    {formattedDate}
                                </Typography>
                                <Typography variant="body1" color="secondary">
                                    {ticket.location}
                                </Typography>
                                <Typography variant="body1" color="secondary">
                                    {'ID: ' + ticket.id}
                                </Typography>
                                <CardActions>
                                    <Box display="flex" mb={1}>
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            <IconButton
                                                aria-label="Ver"
                                                color="primary"
                                                onClick={() => setShowQR(true)}
                                            >
                                                <VisibilityOutlined sx={{ fontSize: 30 }} />
                                            </IconButton>
                                            <Typography variant="caption" color="secondary">
                                                Ver
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", flexDirection: "column" }} mx={1}>
                                            <IconButton
                                                aria-label="Vender"
                                                color="primary"
                                            >
                                                <AttachMoneyOutlined sx={{ fontSize: 30 }} />
                                            </IconButton>
                                            <Typography variant="caption" color="secondary">
                                                Vender
                                            </Typography>
                                        </Box>

                                        {ticket.canShare &&
                                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                <IconButton
                                                    aria-label="Compartir"
                                                    color="primary"
                                                    onClick={() => onShare(ticket.id)}
                                                >
                                                    <Share sx={{ fontSize: 30 }} />
                                                </IconButton>
                                                <Typography variant="caption" color="secondary">
                                                    Compartir
                                                </Typography>
                                            </Box>
                                        }
                                        {(ticket.isOwner && ticket.isShared) &&
                                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                <IconButton
                                                    aria-label="Dejar de compartir"
                                                    color="primary"
                                                    onClick={() => onUnshare(ticket.id)}
                                                >
                                                    <LinkOff sx={{ fontSize: 30 }} />
                                                </IconButton>
                                                <Typography variant="caption" color="secondary">
                                                    Dejar de compartir
                                                </Typography>
                                            </Box>
                                        }
                                    </Box>
                                </CardActions>
                            </Box>
                        </CardContent>
                    </Box>
                </Fade>

                <Fade in={showQR} mountOnEnter unmountOnExit timeout={300}>
                    <Box
                        sx={{
                            position: showQR ? "relative" : "absolute",
                            inset: 0,
                            mt: 5
                        }}
                    >
                        {(ticket.isOwner && ticket.isShared) &&
                            <Box sx={{
                                backgroundColor: "red",
                                position: "absolute",
                                width: "100%",
                                top: "35%",
                                textAlign: "center",
                                py: 1
                            }}>
                                <Typography variant="body1" color="neutral" fontWeight={700}>
                                    Compartido
                                </Typography>
                            </Box>
                        }
                        <Box textAlign="center" mb={2}>
                            <QRCodeSVG value={payload} size={260} level="L" />
                        </Box>
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", width: '100%', textAlign: 'center' }} mt={1}>
                                {shouldGenerateQR &&
                                    <Box>
                                        <Typography variant="inherit" mb={1}>
                                            {secondsRemaining}s
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progressPercent}
                                        />
                                    </Box>
                                }
                                <Button variant="text" sx={{ mt: 1 }} onClick={() => setShowQR(false)}>
                                    Ocultar
                                </Button>
                            </Box>
                        </CardActions>
                    </Box>
                </Fade>
            </Box >
        </Card >
    );
}