"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

import Loader from "@/components/Loader/Loader";
import { formatDate } from "@/helpers/formatDateHelper";
import { OrderType } from "@/models/enums/order-type.enum";
import { OrderDTO } from "@/models/order.dto";
import { SeatDTO } from "@/models/seat.dto";
import { getOrderSuccess } from "@/services/orderService";

import TicketSeats from "../../../event/[eventId]/components/TicketSeats/TicketSeats";

import styles from "./SuccessClient.module.scss";

interface SuccessClientProps {
    orderId: string;
}

export default function SuccessClient({ orderId }: SuccessClientProps) {
    const [order, setOrder] = useState<OrderDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formattedDate, setFormattedDatte] = useState<string>("");
    const [seatMap, setSeatMap] = useState<Array<[string, number]>>();

    useEffect(() => {
        async function load() {
            setIsLoading(true);

            try {
                const response = await getOrderSuccess(Number.parseInt(orderId));

                const mapped: [string, number][] = response.itemSeatsLabels
                    .filter((s): s is SeatDTO & { priceOverride: number } => s.priceOverride !== undefined)
                    .map(s => [s.externalSeatObjectKey, s.priceOverride]);

                setSeatMap(mapped);
                setOrder(response);
                setFormattedDatte(formatDate(response.itemStartDate, "dateTime"))

            }
            catch {
                // TODO: Handle error
            }
            finally {
                setIsLoading(false);
            }
        }

        load();
    }, [orderId]);

    return (
        <Box>
            {order &&
                <Grid container columns={12} spacing={2}>
                    <Grid size={5} mb={10}>
                        <Box py={4}>
                            <Box>
                                <Typography variant="hero" color="primary">
                                    ¡Gracias por tu compra!
                                </Typography>
                                <Box display="flex" flexDirection="row">
                                    {order.orderType === OrderType.SeasonPass &&
                                        <Box sx={{
                                            height: "auto",
                                            width: 250
                                        }} position="relative" mt={2} mr={2}>
                                            <Image
                                                src={order.itemPosterImageUrl}
                                                alt="Evento"
                                                fill
                                                style={{ objectFit: 'cover', borderRadius: 10 }}
                                            />
                                        </Box>
                                    }
                                    <Box>
                                        <Typography variant="h3" color="primary" mt={3} mb={3}>
                                            {order.itemName}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontWeight={400}
                                            color="text"
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                            mb={1}
                                        >
                                            <CalendarTodayOutlined color="primary" />
                                            {formattedDate}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontWeight={400}
                                            color="text"
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                            mb={1}
                                        >
                                            <LocationOnOutlined color="primary" />
                                            {order.itemLocation}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <TicketSeats
                            eventKey={order.itemKey}
                            subTotal={order.subTotal}
                            totalTaxes={order.totalTaxes}
                            total={order.total}
                            currency={order.currency}
                            seats={order.itemSeats}
                            selectedSeats={seatMap}
                            folio={order.folio}
                        />
                    </Grid>
                    <Grid size={7}>
                        <Box className={styles.posterContainer} mt={5}>
                            <Image
                                src={order.itemPosterImageUrl}
                                alt="Poster"
                                className={styles.poster}
                                fill
                            />
                        </Box>
                    </Grid>
                </Grid>
            }
            <Loader isLoading={isLoading} />
        </Box>
    );
}