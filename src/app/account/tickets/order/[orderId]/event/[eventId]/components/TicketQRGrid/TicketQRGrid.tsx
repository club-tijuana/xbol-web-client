import { Box, Button, Grid, Typography } from "@mui/material";

import TicketQRCard from "../TicketQRCard/TicketQRCard";

import { TicketQRGridProps } from "./TicketQRGrid.type";

export default function TicketQRGrid({
    columns,
    spacing = 1,
    title,
    tickets
}: TicketQRGridProps) {
    return (
        <Box>
            <Typography variant="h3" color="primary" mb={2.5}>
                {title}
            </Typography>
            <Grid
                container
                mb={2.5}
                columns={columns}
                spacing={spacing}>
                {tickets.map((ticket) => (
                    <Grid key={ticket.id} size={1}>
                        <TicketQRCard ticket={ticket} />
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" sx={{ py: 1.3, px: 4, mr: 3 }}>
                <Typography variant="body2" color="neutral">
                    Agregar a wallet
                </Typography>
            </Button>
            <Button variant="outlined" sx={{ py: 1.3, px: 4 }}>
                <Typography variant="body2" color="primary">
                    Ver todos
                </Typography>
            </Button>
        </Box>
    );
}