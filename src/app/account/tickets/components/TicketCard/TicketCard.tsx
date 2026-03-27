"use client";

import { Autorenew, VisibilityOutlined } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { formatDate } from "@/helpers/formatDateHelper";

import styles from "./TicketCard.module.scss";
import { TicketCardProps } from "./TicketCard.type";

export default function TicketCard({ ticket }: TicketCardProps) {
    const router = useRouter();
    const { name, eventImage, startDate, location } = ticket;

    const date = new Date(startDate);
    const formattedDate = formatDate(date, "dateTime");

    const handleOpenTicket = () => {
        router.push(`/account/tickets/order/${ticket.orderId}/event/${ticket.eventId}`);
    }

    const handleSeasonRenovate = () => {
        router.push(`/season/renovation/${ticket.orderId}`);
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
                                    color="primary"
                                    onClick={handleOpenTicket}
                                >
                                    <VisibilityOutlined sx={{ fontSize: 40 }} />
                                </IconButton>
                                <Typography variant="bodyXs" color="neutral">
                                    Ver
                                </Typography>
                            </Box>
                            {(ticket.isSeasonPass && ticket.canRenovateSeasonPass) &&
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <IconButton
                                        aria-label="Ver"
                                        color="primary"
                                        onClick={handleSeasonRenovate}
                                    >
                                        <Autorenew sx={{ fontSize: 40 }} />
                                    </IconButton>
                                    <Typography variant="bodyXs" color="neutral">
                                        Renovar
                                    </Typography>
                                </Box>
                            }
                        </CardActions>

                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}