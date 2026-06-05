"use client";

import { Alert, AlertColor, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, Grid, Input, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

import Loader from "@/components/Loader/Loader";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { PaymentMethodDTO } from "@/models/payment-method.dto";
import { payOrderAsync } from "@/services/paymentLinkService";
import { useAppDispatch } from "@/store/hooks";
import { setBookPaymentInfo } from "@/store/slices/bookingFlowSlice";
import { showGeneralMessage } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

import { PaymentProps } from "./Payment.type";

export default function Payment({
    subtotal,
    taxes,
    fees,
    discount,
    total,
    currency,
    paymentLinkCode,
    showTotals = true,
    onPay
}: PaymentProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDTO>({
        ownerName: "",
        cardNumber: "",
        expirationMonth: 0,
        expirationYear: 0
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
    const [sessionId, setSessionId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPaymentMethod(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePay = async () => {
        /* if (!paymentMethod.ownerName) {
            setSnackbarSeverity("warning");
            setSnackbarMessage("Es necesario capturar la información de pago");
            setOpenSnackbar(true);

            return;
        }

        if (!window.PaymentSession) {
            setSnackbarSeverity("error");
            setSnackbarMessage("No fue posible inicializar el formulario de pago");
            setOpenSnackbar(true);

            return;
        }

        window.PaymentSession.updateSessionFromForm("card"); */
        console.log("TOTAL: " + total);
        await dispatch(setBookPaymentInfo({
            cardAmount: total
        }));

        if (onPay) {
            onPay();
        }
        else if (paymentLinkCode) {
            try {
                setLoading(true);
                const response = await payOrderAsync(paymentLinkCode, { cardAmount: total });

                router.push(`/account/tickets/order/${response}/success`);
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
            finally {
                setLoading(false);
            }
        }
    }

    const configurePaymentSession = () => {
        if (!window.PaymentSession || !sessionId) {
            return;
        }

        window.PaymentSession.configure({
            session: sessionId,
            fields: {
                card: {
                    number: "#cardNumber",
                    securityCode: "#securityCode",
                    expiryMonth: "#expiryMonth",
                    expiryYear: "#expiryYear",
                    nameOnCard: "#ownerName"
                }
            },
            callbacks: {
                initialized: (response: any) => {
                    console.log(response);
                },
                formSessionUpdate: async (response: any) => {
                    console.log(response);

                    if (response.status === "ok") {
                        if (onPay) {
                            await onPay();
                        }
                    }
                }
            }
        });
    }

    return (
        <Box>
            <Script src={`https://evopaymentsmexico.gateway.mastercard.com/form/version/100/merchant/TEST2020ECOMM27/session.js`}
                strategy="afterInteractive"
                onLoad={configurePaymentSession} />

            <Typography variant="h4" color="primary">
                Datos de pago
            </Typography>
            <Grid container columns={2} spacing={2} mt={2}>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Nombre del titular
                    </Typography>
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="ownerName"
                            name="ownerName"
                            type={'text'}
                            inputProps={{ style: { fontSize: 16 } }}
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            value={paymentMethod.ownerName}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Numero de tarjeta
                    </Typography>
                    <Box id="cardNumber" />
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Fecha de venicmiento
                    </Typography>
                    <Grid container columns={2} spacing={2}>
                        <Grid size={1}>
                            <Box id="expiryMonth" />
                        </Grid>
                        <Grid size={1}>
                            <Box id="expiryYear" />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        CVV
                    </Typography>
                    <Box id="securityCode" />
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }} alignContent={"end"}>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/payment/payments.svg`}
                        alt="Payment"
                        height={26}
                        width={147}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-muted)' }} />

            {showTotals &&
                <Box>
                    <Grid container columns={4} spacing={3}>
                        <Grid size={1} offset={2} textAlign="right">
                            <Typography variant="body2" color="primary">
                                Subtotal
                            </Typography>
                        </Grid>
                        <Grid size={1} textAlign="right">
                            <Typography variant="body1" color="secondary">
                                {formatCurrency(subtotal ?? 0, currency)}
                            </Typography>
                        </Grid>
                        <Grid size={1} offset={2} textAlign="right">
                            <Typography variant="body2" color="primary">
                                Comisiones
                            </Typography>
                        </Grid>
                        <Grid size={1} textAlign="right">
                            <Typography variant="body1" color="secondary">
                                {formatCurrency(fees ?? 0, currency)}
                            </Typography>
                        </Grid>
                        <Grid size={1} offset={2} textAlign="right">
                            <Typography variant="body2" color="primary">
                                Impuestos
                            </Typography>
                        </Grid>
                        <Grid size={1} textAlign="right">
                            <Typography variant="body1" color="secondary">
                                {formatCurrency(taxes ?? 0, currency)}
                            </Typography>
                        </Grid>
                        <Grid size={1} offset={2} textAlign="right">
                            <Typography variant="body2" color="primary">
                                Descuentos
                            </Typography>
                        </Grid>
                        <Grid size={1} textAlign="right">
                            <Typography variant="body1" color="secondary">
                                {formatCurrency(discount ?? 0, currency)}
                            </Typography>
                        </Grid>
                        <Grid size={1} offset={2} textAlign="right">
                            <Typography variant="body2" color="primary">
                                Total
                            </Typography>
                        </Grid>
                        <Grid size={1} textAlign="right">
                            <Typography variant="body1" color="secondary">
                                {formatCurrency(total ?? 0, currency)}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-muted)' }} />
                </Box>
            }


            <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                    required
                    control={
                        <Checkbox
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                    }
                    sx={{ color: colors.text.muted }}
                    label="Acepto las condiciones de compra"
                />
                <Button variant="contained" color="primary" sx={{ px: 5.5, py: 1.3 }} onClick={handlePay} disabled={!acceptedTerms}>
                    <Typography variant="subtitle1" fontWeight={400} color="neutral">
                        Pagar
                    </Typography>
                </Button>
            </Box>

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={openSnackbar}
                autoHideDuration={5000}>
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Loader isLoading={loading} />
        </Box>
    );
}