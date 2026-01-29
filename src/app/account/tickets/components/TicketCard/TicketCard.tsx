"use client";

import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { TicketCardProps } from "./TicketCard.type";
import { Circle } from "@mui/icons-material";
import styles from "./TicketCard.module.scss";

export default function TicketCard({ ticket, onOpen, onSell, onTransfer }: TicketCardProps) {
    const { ticketCode, image, title, dateStr, location } = ticket;
    
    return (
        <Box>
            <Card variant="outlined" sx={{ border: 'none' }}>
                <CardContent className={styles.cardContent}>
                    <CardMedia
                        component="img"
                        image={image}
                        alt={title}
                        sx={{ display: 'block' }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: "linear-gradient(180deg,rgba(129, 10, 27, 0.6) 10%, rgba(0, 0, 0, 1) 100%)",
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
                        <Typography variant="subtitle2" className="textPrimary textBold">
                            {title}
                        </Typography>
                        <Typography variant="body3" className="textWhite textBold">
                            {dateStr}
                        </Typography>
                        <Typography variant="subtitle2" className="textWhite">
                            {location}
                        </Typography>

                        <CardActions sx={{ justifyContent: "space-around" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <IconButton
                                    aria-label="Ver"
                                    className="textWhite"
                                    onClick={() => onOpen?.(ticketCode)}
                                >
                                    <Circle sx={{ fontSize: 50 }} />
                                </IconButton>
                                <Typography variant="body0" className="textWhite">
                                    Ver
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <IconButton
                                    aria-label="Vender"
                                    className="textWhite"
                                    onClick={() => onSell?.(ticketCode)}
                                >
                                    <Circle sx={{ fontSize: 50 }} />
                                </IconButton>
                                <Typography variant="body0" className="textWhite">
                                    Vender
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <IconButton
                                    aria-label="Transferir"
                                    className="textWhite"
                                    onClick={() => onTransfer?.(ticketCode)}
                                >
                                    <Circle sx={{ fontSize: 50 }} />
                                </IconButton>
                                <Typography variant="body0" className="textWhite">
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