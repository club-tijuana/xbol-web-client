"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";

import SeatsMap from "@/components/SeatsMap/SeatsMap";

import { TicketSeatsProps } from "./TicketSeats.type";


export default function TicketSeats({ eventKey, subTotal, totalTaxes, total, currency, seats, selectedSeats }: TicketSeatsProps) {
    const scale = 0.8;
    const compensatedWidth = `${100 / scale}%`;
    const offsetY = -70;

    return (
        <Paper elevation={3} className="paperCard"
        >
            <Typography variant="h3" color="primary">
                Tus asientos
            </Typography>
            <Grid container columns={12} mt={2}>
                <Grid size={4}>
                    <Box sx={{
                        position: "relative",
                        width: "100%",
                        height: 120,
                        borderStyle: 'solid',
                        borderColor: 'var(--color-text-primary)',
                        borderWidth: 1,
                        borderRadius: '15px',
                        overflow: 'hidden',
                    }}
                    >
                        <Box
                            sx={{
                                transform: `scale(${scale}) translateY(${offsetY}px)`,
                                transformOrigin: "top left",
                                width: compensatedWidth,
                                height: "100%",
                            }}
                        >
                            <SeatsMap eventKey={eventKey} selectedObjects={selectedSeats} mode="print" />
                        </Box>
                    </Box>
                </Grid>
                <Grid size={8}>
                    <Box ml={8} display="flex" flexDirection="column" justifyContent="center" height="100%">
                        {seats.map((seat, index) => (
                            <Box key={index}>
                                <Typography variant="body1" color="muted">
                                    {`Sección ${seat.section}`}
                                </Typography>
                                <Typography variant="body2" color="muted">
                                    {`Asientos: ${seat.seats}`}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-primary)' }} />

            <Grid container columns={4}>
                <Grid size={1} offset={2}>
                    <Typography variant="subtitle1" fontWeight={400} color="primary" textAlign="right">
                        Subtotal
                    </Typography>
                </Grid>
                <Grid size={1}>
                    <Typography variant="subtitle1" fontWeight={400} color="muted" textAlign="right">
                        {`${new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(subTotal)} ${currency}`}
                    </Typography>
                </Grid>
                <Grid size={1} offset={2}>
                    <Typography variant="subtitle1" fontWeight={400} color="primary" textAlign="right">
                        Impuestos
                    </Typography>
                </Grid>
                <Grid size={1}>
                    <Typography variant="subtitle1" fontWeight={400} color="muted" textAlign="right">
                        {`${new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(totalTaxes)} ${currency}`}
                    </Typography>
                </Grid>
                <Grid size={1} offset={2}>
                    <Typography variant="subtitle1" fontWeight={400} color="primary" textAlign="right">
                        Total
                    </Typography>
                </Grid>
                <Grid size={1}>
                    <Typography variant="subtitle1" fontWeight={400} color="muted" textAlign="right">
                        {`${new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(total)} ${currency}`}
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-primary)' }} />

            <Typography variant="h4" fontWeight={400} color="muted" mb={1}>
                Acceso a tus boletos
            </Typography>
            <Typography variant="h6" fontWeight={400} color="text" mb={2}>
                Tus boletos electrónicos han sido enviados a tu correo electrónico registrado.
            </Typography>
            <Typography variant="h6" fontWeight={400} color="text">
                También puedes descargarlos desde tu cuenta en la sección “Mis Tickets”
            </Typography>
        </Paper>
    );
}