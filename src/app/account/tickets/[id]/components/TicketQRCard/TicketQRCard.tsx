"use client";

import { Circle } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";

import styles from "./TicketQRCard.module.scss";
import { TicketQRCardProps } from "./TicketQRCard.type";

export default function TicketQRCard({ ticket }: TicketQRCardProps) {
    const formattedDate = Intl.DateTimeFormat("es-MX", {
        month: 'long',
        year: 'numeric'
    }).format(new Date(ticket.startDate));

    return (
        <Card variant="outlined" className={styles.card}>
            <CardContent className={styles.cardContent}>
                <CardMedia
                    component="img"
                    image={ticket.eventImage}
                    alt={"title"}
                    sx={{ display: 'block', borderRadius: 2.5, height: '100%', width: '100%', objectFit: 'cover' }}
                />

                <Box className={styles.overlay} />

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
                    <CardActions sx={{ justifyContent: "space-around" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <IconButton
                                aria-label="Ver"
                                color="neutral"
                            >
                                <Circle sx={{ fontSize: 43 }} />
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
                                <Circle sx={{ fontSize: 43 }} />
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
                                <Circle sx={{ fontSize: 43 }} />
                            </IconButton>
                            <Typography variant="bodyXs" color="neutral">
                                Transferir
                            </Typography>
                        </Box>
                    </CardActions>
                </Box>
            </CardContent>
        </Card>
    );
}