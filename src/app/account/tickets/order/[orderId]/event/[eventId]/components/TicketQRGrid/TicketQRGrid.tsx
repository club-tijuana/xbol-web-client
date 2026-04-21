"use client";

import { Box, Grid, Typography } from "@mui/material";

import TicketQRGridItem from "../TicketQRGridItem/TicketQRGridItem";

import { TicketQRGridProps } from "./TicketQRGrid.type";

export default function TicketQRGrid({
    columns,
    spacing = 1,
    title,
    tickets,
    onShare,
    onUnshare
}: TicketQRGridProps) {
    const handleShareTicket = (ticketToShareId: number) => {
        onShare(ticketToShareId);
    };

    const handleUnshareTicket = (ticketToUnshareId: number) => {
        onUnshare(ticketToUnshareId);
    };

    return (
        <Box>
            <Typography variant="h4" color="primary" mb={2.5}>
                {title}
            </Typography>
            <Grid
                container
                mb={2.5}
                columns={columns}
                spacing={spacing}>
                {tickets.map((ticket) => (
                    <Grid key={ticket.id} size={1}>
                        <TicketQRGridItem ticket={ticket} onShare={handleShareTicket} onUnshare={handleUnshareTicket} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}