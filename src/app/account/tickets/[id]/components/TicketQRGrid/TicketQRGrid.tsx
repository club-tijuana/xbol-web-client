import { Box, Grid, Typography } from "@mui/material";

import TicketQRCard from "../TicketQRCard/TicketQRCard";

import { TicketQRGridProps } from "./TicketQRGrid.type";

export default function TicketQRGrid({
    columnsXs,
    columnsSm,
    columnsMd,
    columnsLg,
    columnsXl,
    spacing = 1,
    title,
    tickets
}: TicketQRGridProps) {
    return (
        <Box>
            <Typography variant="xl2" className="textPrimary">
                {title}
            </Typography>
            <Grid
                container
                columns={{
                    xs: columnsXs,
                    sm: columnsSm,
                    md: columnsMd,
                    lg: columnsLg,
                    xl: columnsXl
                }}
                spacing={spacing}>
                {tickets.map((ticket) => (
                    <Grid key={ticket.id} size={1}>
                        <TicketQRCard ticket={ticket} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}