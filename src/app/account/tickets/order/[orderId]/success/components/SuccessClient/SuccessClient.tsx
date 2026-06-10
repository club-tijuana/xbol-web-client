"use client";

import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

import Loader from "@/components/Loader/Loader";
import { formatDate } from "@/helpers/formatDateHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { OrderType } from "@/models/enums/order-type.enum";
import { eventImageOrDefault } from "@/models/event-image";
import { OrderDTO } from "@/models/order.dto";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { getOrderSuccess } from "@/services/orderService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearGeneralMessage, showGeneralMessage } from "@/store/slices/uiSlice";

import TicketSeats from "../../../event/[eventId]/components/TicketSeats/TicketSeats";

interface SuccessClientProps {
    orderId: string;
}

export default function SuccessClient({ orderId }: SuccessClientProps) {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.auth.user?.token);
    const generalMessage = useAppSelector(state => state.ui.generalMessage);
    const user = useAppSelector(state => state.auth.user);
    const [order, setOrder] = useState<OrderDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formattedDate, setFormattedDatte] = useState<string>("");
    const [seatMap, setSeatMap] = useState<Array<BookingSeatRequest>>();

    useEffect(() => {
        async function load() {
            setIsLoading(true);

            try {
                const response = await getOrderSuccess(Number.parseInt(orderId));

                const mapped: BookingSeatRequest[] = response.itemSeatsLabels.map(
                    seat => ({
                        seatKey: seat.externalSeatObjectKey,
                        seatPrice: seat.priceOverride ?? 0,
                        priceListItemId: seat.priceListItemId ?? 0
                    })
                );

                setSeatMap(mapped);
                setOrder(response);
                setFormattedDatte(formatDate(response.itemStartDate, "dateTime"))

            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
            finally {
                setIsLoading(false);
            }
        }

        load();
    }, [orderId, token]);

    return (
        <Box mt={20}>
            {order &&
                <Grid container columns={12} spacing={2}>
                    <Grid size={{ xs: 12, lg: 5 }} mb={{ xs: 0, lg: 6 }}>
                        <Box py={4}>
                            <Box>
                                <Typography variant="h1" color="primary">
                                    ¡Gracias por tu compra!
                                </Typography>
                                <Box display="flex" flexDirection="row" mt={2}>
                                    {order.orderType === OrderType.SeasonPass &&
                                        <Box sx={{
                                            position: "relative",
                                            display: "flex",
                                            justifyContent: "center",
                                            width: "100%",
                                            height: "100%",
                                            aspectRatio: "16 / 9",
                                            overflow: "hidden",
                                            maxWidth: 250,
                                        }} position="relative" mt={2} mr={2}>
                                            <Image
                                                src={eventImageOrDefault(order.itemPosterImageUrl)}
                                                alt="Evento"
                                                fill
                                                onError={(e) => {
                                                    e.currentTarget.src = eventImageOrDefault();
                                                }}
                                                style={{
                                                    objectFit: 'cover',
                                                    objectPosition: "center",
                                                    borderRadius: 10
                                                }}
                                            />
                                        </Box>
                                    }
                                    <Box>
                                        <Typography variant="h4" color="primary" mt={3} mb={3}>
                                            {order.itemName}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            color="secondary"
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                            mb={1}
                                        >
                                            <CalendarTodayOutlined color="primary" />
                                            {formattedDate}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            color="secondary"
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
                        {(user && user.clientId) &&
                            <TicketSeats
                                eventKey={order.itemKey}
                                subTotal={order.subTotal}
                                totalTaxes={order.totalTaxes}
                                totalFees={order.totalFees}
                                discount={order.discount}
                                total={order.total}
                                currency={"MXN"}
                                seats={order.itemSeats}
                                selectedSeats={seatMap}
                                folio={order.folio}
                            />
                        }
                        {(!user || !user.clientId) &&
                            <Box>
                                <Typography variant="h6" color="secondary">
                                    Tus boletos fueron enviados al correo electrónico que capturaste durante la compra.
                                </Typography>
                            </Box>
                        }
                    </Grid>
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <Box
                            mt={{ xs: 4, lg: 5 }}
                            mb={{ xs: 4, lg: 0 }}
                            sx={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                aspectRatio: "16 / 9",
                                overflow: "hidden"
                            }}
                        >
                            <Image
                                src={eventImageOrDefault(order.itemPosterImageUrl)}
                                alt="Poster"
                                fill
                                onError={(e) => {
                                    e.currentTarget.src = eventImageOrDefault();
                                }}
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center"
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            }
            <Loader isLoading={isLoading} />

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={!!generalMessage.message}
                autoHideDuration={4000}
                onClose={() => dispatch(clearGeneralMessage())}>
                <Alert
                    severity={generalMessage.severity}
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {generalMessage.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
