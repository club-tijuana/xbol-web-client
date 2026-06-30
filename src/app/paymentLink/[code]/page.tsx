import { CalendarTodayOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import TicketSeats from "@/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketSeats/TicketSeats";
import Loader from "@/components/Loader/Loader";
import { formatDate } from "@/helpers/formatDateHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { eventImageOrDefault } from "@/models/event-image";
import { OrderDTO } from "@/models/order.dto";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { getEventMetadataByPaymentCodeAsync, getOrderToPayAsync } from "@/services/paymentLinkService";
import { withPublicRedirectBasePath } from "@/utils/routing/basePath";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import PaymentLinkClient from "./PaymentLinkClient";

interface PageProps {
    params: Promise<{
        code: string;
    }>;
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { code } = await params;

    const metadata = await getEventMetadataByPaymentCodeAsync(code);

    return buildSeoMetadata({
        title: metadata.title,
        description: metadata.description ?? "",
        url: "",
        image: metadata.imageUrl,
        type: "website"
    });
}

export default async function PaymentLinkPage({ params }: PageProps) {
    const { code } = await params;

    let orderToPay: OrderDTO | undefined;

    try {
        orderToPay = await getOrderToPayAsync(code);
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        redirect(withPublicRedirectBasePath(`/?error=${encodeURIComponent(errorMessage)}`));
    }

    const selectedSeats: BookingSeatRequest[] =
        orderToPay?.itemSeatsLabels?.map(seat => ({
            seatKey: seat.externalSeatObjectKey,
            seatPrice: seat.priceOverride ?? 0,
            priceListItemId: seat.priceListItemId ?? 0
        })) ?? [];

    return (
        <Box my={20} sx={{ minHeight: '100vh' }}>
            <Grid container columns={2} spacing={10}>
                <Grid size={{ xs: 2, lg: 1 }}>
                    <Box display="flex" flexDirection="row" mb={5}>
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
                                src={eventImageOrDefault(orderToPay.itemPosterImageUrl)}
                                alt="Evento"
                                fill
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: "center",
                                    borderRadius: 10
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h4" color="primary" mt={3} mb={3}>
                                {orderToPay.itemName}
                            </Typography>
                            <Typography
                                variant="h5"
                                color="secondary"
                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                mb={1}
                            >
                                <CalendarTodayOutlined color="primary" />
                                {formatDate(orderToPay.itemStartDate, "dateTime")}
                            </Typography>
                            <Typography
                                variant="h5"
                                color="secondary"
                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                mb={1}
                            >
                                <LocationOnOutlined color="primary" />
                                {orderToPay.itemLocation}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Grid container columns={2} spacing={10}>
                <Grid size={{ xs: 2, lg: 1 }}>
                    <TicketSeats
                        eventKey={orderToPay.itemKey}
                        subTotal={orderToPay.subTotal}
                        totalFees={orderToPay.totalFees}
                        totalTaxes={orderToPay.totalTaxes}
                        discount={orderToPay.discount}
                        total={orderToPay.total}
                        fees={orderToPay.fees}
                        seats={orderToPay.itemSeats}
                        selectedSeats={selectedSeats}
                    />
                </Grid>
                <Grid size={{ xs: 2, lg: 1 }}>
                    <PaymentLinkClient code={code} order={orderToPay} />
                </Grid>
            </Grid>

            <Loader isLoading={orderToPay === undefined} />
        </Box>
    );
}
