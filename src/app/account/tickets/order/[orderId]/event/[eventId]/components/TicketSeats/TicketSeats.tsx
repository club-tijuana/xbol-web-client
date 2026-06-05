"use client";

import { Box, Button, Divider, Grid, Paper, SxProps, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import SeatsMap from "@/components/SeatsMap/SeatsMap";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";

import { TicketSeatsProps } from "./TicketSeats.type";

/* -------------------- CONSTANTS -------------------- */
const SCALE = 0.8;
const COMPENSATED_WIDTH = `${100 / SCALE}%`;
const OFFSET_Y = -110;

/* -------------------- STYLES -------------------- */
const contentStyle: SxProps = {
    position: "relative",
    width: "100%",
    height: 170,
    borderStyle: 'solid',
    borderColor: 'var(--color-text-primary)',
    borderWidth: 1,
    borderRadius: '15px',
    overflow: 'hidden',
};

/* -------------------- COMPONENT -------------------- */
export default function TicketSeats({ eventKey, subTotal, totalFees, totalTaxes, discount, total, currency, seats, selectedSeats, folio }: TicketSeatsProps) {
    const router = useRouter();

    const handleGoToMyTickets = () => {
        router.push(`/account/tickets`);
    }

    return (
        <Paper elevation={3} className="paperCard"
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" color="primary">
                    Tus asientos
                </Typography>
                {folio &&
                    <Typography variant="body2" color="primary">
                        Folio {folio}
                    </Typography>
                }
            </Box>
            <Grid container columns={12} mt={3.5}>
                <Grid size={4}>
                    <Box sx={contentStyle}>
                        <Box
                            sx={{
                                transform: `scale(${SCALE}) translateY(${OFFSET_Y}px)`,
                                transformOrigin: "top left",
                                width: COMPENSATED_WIDTH,
                                height: "100%"
                            }}
                        >
                            <SeatsMap eventKey={eventKey} initialSeats={selectedSeats} mode="print" />
                        </Box>
                    </Box>
                </Grid>
                <Grid size={8}>
                    <Box ml={8} display="flex" flexDirection="column" justifyContent="center" height="100%">
                        {seats.map((seat, index) => (
                            <Box key={index} mb={2}>
                                <Typography variant="body1" color="secondary">
                                    {`Sección ${seat.section}`}
                                </Typography>
                                <Typography variant="caption" color="muted">
                                    {`Asientos: ${seat.seats}`}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>

            {subTotal !== undefined &&
                <Divider sx={{ mb: 3, mt: 5, borderWidth: 1, borderTop: "none", borderColor: 'var(--color-tertiary)' }} />
            }

            {subTotal !== undefined &&
                <Grid container columns={4}>
                    <Grid size={1} offset={2}>
                        <Typography variant="body2" color="primary" textAlign="right">
                            Subtotal
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body1" color="secondary" textAlign="right">
                            {formatCurrency(subTotal, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }
            {totalFees !== undefined &&
                <Grid container columns={4} mt={3}>
                    <Grid size={1} offset={2}>
                        <Typography variant="body2" color="primary" textAlign="right">
                            Comisiones
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body1" color="secondary" textAlign="right">
                            {formatCurrency(totalFees, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }
            {totalTaxes !== undefined &&
                <Grid container columns={4} mt={3}>
                    <Grid size={1} offset={2}>
                        <Typography variant="body2" color="primary" textAlign="right">
                            Impuestos
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body1" color="secondary" textAlign="right">
                            {formatCurrency(totalTaxes, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }
            {discount !== undefined &&
                <Grid container columns={4} mt={3}>
                    <Grid size={1} offset={2}>
                        <Typography variant="body2" color="primary" textAlign="right">
                            Descuentos
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body1" color="secondary" textAlign="right">
                            {formatCurrency(discount, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }
            {total !== undefined &&
                <Grid container columns={4} mt={3}>
                    <Grid size={1} offset={2}>
                        <Typography variant="body2" color="primary" textAlign="right">
                            Total
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body1" color="secondary" textAlign="right">
                            {formatCurrency(total, currency)}
                        </Typography>
                    </Grid>
                </Grid>
            }

            {subTotal !== undefined &&
                <>
                    <Divider sx={{ my: 3, borderWidth: 1, borderTop: "none", borderColor: 'var(--color-tertiary)' }} />

                    <Typography variant="h4" color="primary" mb={1}>
                        Acceso a tus tickets
                    </Typography>
                    <Typography variant="subtitle1" color="secondary" mb={2}>
                        Tus tickets electrónicos han sido enviados a tu correo electrónico registrado.
                    </Typography>
                    <Typography variant="subtitle1" color="secondary">
                        También puedes descargarlos desde tu cuenta en la sección “Mis Tickets”
                    </Typography>

                    {folio &&
                        <Box textAlign={"center"} mt={3}>
                            <Button variant="outlined" size="medium" onClick={handleGoToMyTickets}>
                                Ir a mis tickets
                            </Button>
                        </Box>
                    }
                </>
            }
        </Paper>
    );
}