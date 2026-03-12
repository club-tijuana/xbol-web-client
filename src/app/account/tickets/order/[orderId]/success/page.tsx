import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

import Advertisement from "@/components/Advertisement/Advertisement";
import EventCardGrid from "@/components/EventCardGrid/EventCardGrid";
import FAQ from "@/components/FAQ/FAQ";
import { formatDate } from "@/helpers/formatDateHelper";
import { mapEventToCardVM } from "@/models/event-item.dto";
import { getTrendingEvents } from "@/services/eventService";
import { getOrderSuccess } from "@/services/orderService";

import TicketSeats from "../event/[eventId]/components/TicketSeats/TicketSeats";

import styles from "./page.module.scss";

interface SuccessPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function SuccessPage(props: SuccessPageProps) {
    const { orderId } = await props.params;
    const order = await getOrderSuccess(Number.parseInt(orderId));

    const trendingEvents = await getTrendingEvents({ page: 1, pageSize: 4 });
    const trendingEventsVM = trendingEvents.items.map(mapEventToCardVM);

    const formattedEventDate = formatDate(order.events[0].startDate, "dateTime");

    return (
        <Box>
            <Grid container columns={12}>
                <Grid size={5}>
                    <Box>
                        <Typography variant="hero" color="primary">
                            ¡Gracias por tu compra!
                        </Typography>
                        <Typography variant="h3" color="primary">
                            {order.events[0].name}
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight={400}
                            color="text"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                            <CalendarTodayOutlined color="primary" />
                            {formattedEventDate}
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight={400}
                            color="text"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                            <LocationOnOutlined color="primary" />
                            {order.events[0].location}
                        </Typography>
                    </Box>

                    <TicketSeats
                        eventKey={order.events[0].eventKey}
                        subTotal={order.subTotal}
                        totalTaxes={order.totalTaxes}
                        total={order.total}
                        currency={order.currency}
                        seats={order.events[0].seats}
                        folio={order.folio}
                    />
                </Grid>
                <Grid size={7}>
                    <Box className={styles.posterContainer}>
                        <Image
                            src={order.events[0].posterImageUrl}
                            alt="Poster"
                            className={styles.poster}
                            fill
                        />
                    </Box>
                </Grid>
            </Grid>

            <FAQ />

            <Grid container columns={2}>
                <Grid size={1}>
                    <Advertisement image="/assets/images/advertisement/advertisement.png" />
                </Grid>
                <Grid size={1}>
                    <Typography variant="h2" fontWeight={400} color="primary">
                        Otros eventos
                    </Typography>
                    <EventCardGrid
                        eventCards={trendingEventsVM}
                        sizeVariant="xs"
                        styleVariant="default"
                        showCardActions={false}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}