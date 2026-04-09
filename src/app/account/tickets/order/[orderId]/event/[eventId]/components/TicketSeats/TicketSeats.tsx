"use client";

import { Box, Divider, Grid, Paper, SxProps, Typography } from "@mui/material";

import SeatsMap from "@/components/SeatsMap/SeatsMap";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";

import { TicketSeatsProps } from "./TicketSeats.type";

/* -------------------- CONSTANTS -------------------- */
const SCALE = 0.8;
const COMPENSATED_WIDTH = `${100 / SCALE}%`;
const OFFSET_Y = -70;

/* -------------------- STYLES -------------------- */
const contentStyle: SxProps = {
    position: "relative",
    width: "100%",
    height: 120,
    borderStyle: 'solid',
    borderColor: 'var(--color-text-primary)',
    borderWidth: 1,
    borderRadius: '15px',
    overflow: 'hidden',
};

/* -------------------- COMPONENT -------------------- */
export default function TicketSeats({ eventKey, subTotal, totalTaxes, total, currency, seats, selectedSeats, folio }: TicketSeatsProps) {
    return (
        <Paper elevation={3} className="paperCard"
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color="primary">
                    Tus asientos
                </Typography>
                {folio &&
                    <Typography variant="subtitle1" color="primary">
                        Folio {folio}
                    </Typography>
                }
            </Box>
            <Grid container columns={12} mt={2}>
                <Grid size={4}>
                    <Box sx={contentStyle}>
                        <Box
                            sx={{
                                transform: `scale(${SCALE}) translateY(${OFFSET_Y}px)`,
                                transformOrigin: "top left",
                                width: COMPENSATED_WIDTH,
                                height: "100%",
                            }}
                        >
                            <SeatsMap eventKey={eventKey} initialSeats={selectedSeats} mode="print" session="continue" />
                        </Box>
                    </Box>
                </Grid>
                <Grid size={8}>
                    <Box ml={8} display="flex" flexDirection="column" justifyContent="center" height="100%">
                        {seats.map((seat, index) => (
                            <Box key={index} mb={2}>
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

            {subTotal !== undefined &&
                <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-primary)' }} />
            }

            {subTotal !== undefined &&
                <Grid container columns={4}>
                    <Grid size={1} offset={2}>
                        <Typography variant="subtitle1" fontWeight={400} color="primary" textAlign="right">
                            Subtotal
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="subtitle1" fontWeight={400} color="muted" textAlign="right">
                            {formatCurrency(subTotal, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }
            {totalTaxes !== undefined &&
                <Grid container columns={4}>
                    <Grid size={1} offset={2}>
                        <Typography variant="subtitle1" fontWeight={400} color="primary" textAlign="right">
                            Impuestos
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="subtitle1" fontWeight={400} color="muted" textAlign="right">
                            {formatCurrency(totalTaxes, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }
            {total !== undefined &&
                <Grid container columns={4}>
                    <Grid size={1} offset={2}>
                        <Typography variant="subtitle1" fontWeight={400} color="primary" textAlign="right">
                            Total
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="subtitle1" fontWeight={400} color="muted" textAlign="right">
                            {formatCurrency(total, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }

            {subTotal !== undefined &&
                <>
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
                </>
            }
        </Paper>
    );
}