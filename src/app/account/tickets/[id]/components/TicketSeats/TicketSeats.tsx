"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";

export default function TicketSeats() {
    return (
        <Paper elevation={3} sx={{
            paddingTop: '27px',
            paddingBottom: '27px',
            paddingLeft: '44px',
            paddingRight: '44px',
            borderRadius: '29px',
        }}
        >
            <Typography variant="xl2" className="textPrimary">
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
                        borderRadius: '15px'
                    }}
                    >
                        <Image
                            src="/assets/images/my-tickets/ticket-details/location-map.png"
                            alt="Mapa"
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </Box>
                </Grid>
                <Grid size={8}>
                    <Box ml={8} display="flex" flexDirection="column" justifyContent="center" height="100%">
                        <Typography variant="subtitle2" className="textSecondary">
                            Sección A Fila 10 x2
                        </Typography>
                        <Typography variant="body1" className="textSecondary">
                            Asientos: 10A, 11 A
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-primary)' }} />

            <Grid container columns={4}>
                <Grid size={1} offset={2}>
                    <Typography variant="subtitle2" className="textPrimary" textAlign="right">
                        Subtotal
                    </Typography>
                </Grid>
                <Grid size={1}>
                    <Typography variant="subtitle2" className="textSecondary" textAlign="right">
                        $0,000.00
                    </Typography>
                </Grid>
                <Grid size={1} offset={2}>
                    <Typography variant="subtitle2" className="textPrimary" textAlign="right">
                        Impuestos
                    </Typography>
                </Grid>
                <Grid size={1}>
                    <Typography variant="subtitle2" className="textSecondary" textAlign="right">
                        $0,000.00
                    </Typography>
                </Grid>
                <Grid size={1} offset={2}>
                    <Typography variant="subtitle2" className="textPrimary" textAlign="right">
                        Total
                    </Typography>
                </Grid>
                <Grid size={1}>
                    <Typography variant="subtitle2" className="textSecondary" textAlign="right">
                        $0,000.00
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-primary)' }} />

            <Typography variant="h5" mb={1} className="textSecondary">
                Acceso a tus boletos
            </Typography>
            <Typography variant="subtitle1" mb={2}>
                Tus boletos electrónicos han sido enviados a tu correo electrónico registrado.
            </Typography>
            <Typography variant="subtitle1">
                También puedes descargarlos desde tu cuenta en la sección “Mis Tickets”
            </Typography>
        </Paper>
    );
}