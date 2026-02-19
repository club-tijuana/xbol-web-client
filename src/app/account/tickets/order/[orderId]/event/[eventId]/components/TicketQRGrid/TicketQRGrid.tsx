import { Box, Grid, Typography } from "@mui/material";

import TicketQRGridItem from "../TicketQRGridItem/TicketQRGridItem";

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
                        <TicketQRGridItem ticket={ticket} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}