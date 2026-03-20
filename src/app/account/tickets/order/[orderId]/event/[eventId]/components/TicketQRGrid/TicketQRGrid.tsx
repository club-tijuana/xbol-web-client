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
    /*     const [ticketId, setTicketId] = useState<number | null>(null);
        const [ticketOrderType, setTicketOrderType] = useState<OrderType>(OrderType.Ticket);
        const [openSnackbar, setOpenSnackbar] = useState(false);
        const [snackbarMessage, setSnackbarMessage] = useState("");
        const [openShare, setOpenShare] = useState(false);
        const [shareType, setShareType] = useState<"share" | "unshare">("share"); */

    const handleShareTicket = (ticketToShareId: number) => {
        onShare(ticketToShareId);
    };

    const handleUnshareTicket = (ticketToUnshareId: number) => {
        onUnshare(ticketToUnshareId);
    };

    /*     const handleUnshareTicket = (ticketToUnshareId: number, orderType: OrderType) => {
            setTicketId(ticketToUnshareId);
            setTicketOrderType(orderType);
            setShareType("unshare");
            setOpenShare(true);
        }; */

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
                        <TicketQRGridItem ticket={ticket} onShare={handleShareTicket} onUnshare={handleUnshareTicket} />
                    </Grid>
                ))}
            </Grid>

            {/* {ticketId &&
                <ShareTicketDialog
                    ticketId={ticketId}
                    orderType={ticketOrderType}
                    open={openShare}
                    variant={shareType}
                    onClose={(message) => handleDialogClose(message)}
                />
            } */}
            {/* <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSnackbar}
                autoHideDuration={5000}>
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar> */}
        </Box>
    );
}