"use client";

import { BarcodeReader, GridOn } from "@mui/icons-material";
import { Alert, Box, Button, Snackbar, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";

import useIsVisible from "@/hooks/useIsVisible";
import { OrderType } from "@/models/enums/order-type.enum";
import { colors } from "@/theme/colors";

import CarouselQRTickets from "../CarouselQRTickets/CarouselQRTickets";
import ShareTicketDialog from "../ShareTicketDialog/ShareTicketDialog";
import TicketQRGrid from "../TicketQRGrid/TicketQRGrid";

import { TicketQRTabsProps } from "./TicketQRTabs.types";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mt: 4 }}>{children}</Box>}
        </div>
    );
}

export default function TicketQRTabs({
    tickets
}: TicketQRTabsProps) {
    const [ref, isVisible] = useIsVisible();
    const [value, setValue] = useState(0);

    const [ticketId, setTicketId] = useState<number | null>(null);
    const [ticketOrderType, setTicketOrderType] = useState<OrderType>(OrderType.Ticket);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openShare, setOpenShare] = useState(false);
    const [shareType, setShareType] = useState<"share" | "unshare">("share");

    const tabStyles = {
        border: "solid",
        borderColor: colors.light.primary,
        color: colors.light.primary,
        borderWidth: 1,
        borderRadius: 15,
        py: 1,
        px: 3,
        height: 32,
        minHeight: "auto",
        mr: 1.5,
        fontWeight: 400,
        fontSize: 15,
        "&.Mui-selected": {
            backgroundColor: colors.light.text,
            color: colors.light.neutral,
        },
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleDialogClose = (message: string | undefined) => {
        if (message) {
            setSnackbarMessage(message);
            setOpenSnackbar(true);
        }

        setOpenShare(false);
    };

    const handleShareTicket = (ticketToShareId: number) => {
        const ticket = tickets.find(t => t.id === ticketToShareId);

        if (ticket) {
            setTicketId(ticket?.id);
            setTicketOrderType(ticket.orderType);
            setShareType("share");
            setOpenShare(true);
        }
    };

    const handleUnshareTicket = (ticketToUnshareId: number) => {
        const ticket = tickets.find(t => t.id === ticketToUnshareId);

        if (ticket) {
            setTicketId(ticket?.id);
            setTicketOrderType(ticket.orderType);
            setShareType("unshare");
            setOpenShare(true);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ typography: "body1" }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Lectura" icon={<BarcodeReader />} iconPosition="start" sx={tabStyles} {...a11yProps(0)} />
                    <Tab label="Tabla" icon={<GridOn />} iconPosition="start" sx={tabStyles} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <Box ref={ref}>
                <CustomTabPanel value={value} index={0}>
                    <CarouselQRTickets
                        tickets={tickets}
                        isTabActive={value === 0 && isVisible}
                        onShare={handleShareTicket}
                        onUnshare={handleUnshareTicket}
                    />
                </CustomTabPanel>
            </Box>
            <CustomTabPanel value={value} index={1}>
                <TicketQRGrid
                    columns={{ xs: 1, sm: 2, md: 3, lg: 2, xl: 3 }}
                    spacing={1.5}
                    title="Tus boletos"
                    tickets={tickets}
                    onShare={handleShareTicket}
                    onUnshare={handleUnshareTicket}
                />
            </CustomTabPanel>
            <Button variant="contained" sx={{ py: 1.3, px: 4, mr: 3 }}>
                <Typography variant="body2" color="neutral">
                    Agregar a wallet
                </Typography>
            </Button>
            {value !== 0 &&
                <Button variant="outlined" sx={{ py: 1.3, px: 4 }}>
                    <Typography variant="body2" color="primary">
                        Ver todos
                    </Typography>
                </Button>
            }

            {ticketId &&
                <ShareTicketDialog
                    ticketId={ticketId}
                    orderType={ticketOrderType}
                    open={openShare}
                    variant={shareType}
                    onClose={(message) => handleDialogClose(message)}
                />
            }
            <Snackbar
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
            </Snackbar>
        </Box>
    );
}