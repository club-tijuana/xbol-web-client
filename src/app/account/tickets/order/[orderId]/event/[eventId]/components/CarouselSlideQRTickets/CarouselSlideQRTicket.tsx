"use client";

import { AttachMoneyOutlined, LinkOff, Share } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, LinearProgress, SxProps, Theme, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { ReactNode } from "react";
import { useCallback, useState } from "react";

import { formatDate } from "@/helpers/formatDateHelper";
import { useQrTimer } from "@/hooks/useQrTimer";

import styles from "./CarouselSlideQRTicket.module.scss";
import { CarouselSlideQRTicketProps } from "./CarouselSlideQRTicket.type";

type TicketActionProps = {
    icon: ReactNode;
    label: string;
    onClick: () => void;
};

const actionSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const sharedBanner: SxProps<Theme> = {
    backgroundColor: "red",
    position: "absolute",
    width: "100%",
    top: "43%",
    textAlign: "center",
    py: 1
};

function TicketAction({ icon, label, onClick }: TicketActionProps) {
    return (
        <Box sx={actionSx}>
            <IconButton color="primary" onClick={onClick}>
                {icon}
            </IconButton>
            <Typography variant="caption" color="secondary">
                {label}
            </Typography>
        </Box>
    );
};

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
                            image={ticket.eventImage}
                            sx={{
                                aspectRatio: "1 / 1",
                                borderRadius: 2.5,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        />
                    </CardContent>
                </Box>
                <Box sx={{ backgroundColor: "white", justifySelf: "center" }} mt={5} mb={2}>
                    <Box textAlign="center" sx={{ position: "relative" }}>
                        {(ticket.isOwner && ticket.isShared) &&
                            <Box sx={sharedBanner}>
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

                            <Box className={styles.cardInfo} mt={4} mb={1}>
                                <Typography variant="subtitle2" color="primary">
                                    {ticket.name}
                                </Typography>
                                <Typography variant="body1" color="secondary">
                                    {formattedDate}
                                </Typography>
                                <Typography variant="body1" color="secondary">
                                    {ticket.location}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    {`Sección ${ticket.section}`}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    {`Fila ${ticket.row}, Asiento ${ticket.seat}`}
                                </Typography>
                            </Box>

                            <Box display="flex" flexDirection="row" justifyContent="space-around" mt={3}>
                                <Box sx={actionSx}>
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
                                    <TicketAction
                                        icon={<Share sx={{ fontSize: 30 }} />}
                                        label="Compartir"
                                        onClick={() => onShare(ticket.id)}
                                    />
                                }
                                {(ticket.isOwner && ticket.isShared) &&
                                    <TicketAction
                                        icon={<LinkOff sx={{ fontSize: 30 }} />}
                                        label="Dejar de compartir"
                                        onClick={() => onUnshare(ticket.id)}
                                    />
                                }
                            </Box>
                        </Box>
                    </CardActions>
                </Box>
            </Box>
        </Card >
    );
}