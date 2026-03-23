"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

import Loader from "@/components/Loader/Loader";
import { formatDate } from "@/helpers/formatDateHelper";
import { OrderDTO } from "@/models/order.dto";
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

    useEffect(() => {
        async function load() {
            setIsLoading(true);

            try {
                const response = await getOrderSuccess(Number.parseInt(orderId));
                setOrder(response);
                setFormattedDatte(formatDate(response.events[0].startDate, "dateTime"))
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
            {(order && order.events) &&
                <Grid container columns={12} spacing={2}>
                    <Grid size={5} mb={10}>
                        <Box py={4}>
                            <Typography variant="hero" color="primary">
                                ¡Gracias por tu compra!
                            </Typography>
                            <Typography variant="h3" color="primary" mt={3} mb={3}>
                                {order.events[0].name}
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
                        <Box className={styles.posterContainer} mt={5}>
                            <Image
                                src={order.events[0].posterImageUrl}
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