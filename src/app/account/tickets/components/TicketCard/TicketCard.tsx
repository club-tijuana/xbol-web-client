"use client";

import { Circle } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import styles from "./TicketCard.module.scss";
import { TicketCardProps } from "./TicketCard.type";

export default function TicketCard({ ticket }: TicketCardProps) {
    const router = useRouter();
    const { name, eventImage, startDate, location } = ticket;

    const date = new Date(startDate);
    const formattedDate = Intl.DateTimeFormat("es-MX", {
        month: 'long',
        year: 'numeric'
    }).format(date);

    const handleOpenTicket = () => {
        router.push(`/account/tickets/${ticket.eventId}`);
    }

    return (
        <Box>
            <Card variant="outlined" sx={{ border: 'none', height: 357, width: "100%" }}>
                <CardContent className={styles.cardContent}>
                    <CardMedia
                        component="img"
                        image={eventImage}
                        alt={name}
                        sx={{ display: 'block', borderRadius: 2.5, height: '100%', width: '100%' }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: "linear-gradient(180deg,rgba(204, 153, 51, 0.44) 10%, rgba(0, 0, 0, 1) 100%)",
                            pointerEvents: 'none',
                            borderRadius: 3
                        }}
                    />

                    <Box sx={{
                        position: 'absolute',
                        textAlign: 'center',
                        pb: 2,
                        zIndex: 2,
                        pointerEvents: "auto",
                        justifySelf: 'center',
                        alignSelf: 'flex-end',
                    }}>
                        <Typography variant="subtitle1" color="primary">
                            {name}
                        </Typography>
                        <Typography variant="subtitle2" color="neutral">
                            {formattedDate}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={400} color="neutral">
                            {location}
                        </Typography>

                        <CardActions sx={{ justifyContent: "space-around" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <IconButton
                                    aria-label="Ver"
                                    color="neutral"
                                    onClick={handleOpenTicket}
                                >
                                    <Circle sx={{ fontSize: 50 }} />
                                </IconButton>
                                <Typography variant="bodyXs" color="neutral">
                                    Ver
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <IconButton
                                    aria-label="Vender"
                                    color="neutral"
                                >
                                    <Circle sx={{ fontSize: 50 }} />
                                </IconButton>
                                <Typography variant="bodyXs" color="neutral">
                                    Vender
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <IconButton
                                    aria-label="Transferir"
                                    color="neutral"
                                >
                                    <Circle sx={{ fontSize: 50 }} />
                                </IconButton>
                                <Typography variant="bodyXs" color="neutral">
                                    Transferir
                                </Typography>
                            </Box>
                        </CardActions>

                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}