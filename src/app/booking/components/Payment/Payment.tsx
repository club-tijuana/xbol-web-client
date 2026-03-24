"use client";

import { Alert, AlertColor, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, Grid, Input, Snackbar, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Image from "next/image";
import { useState } from "react";

import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { PaymentMethodDTO } from "@/models/payment-method.dto";

import { PaymentProps } from "./Payment.type";

export default function Payment({ subtotal, taxes, total, currency, onPay }: PaymentProps) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPaymentMethod(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePay = () => {
        if (
            !paymentMethod.ownerName
            || !paymentMethod.cardNumber
            || !paymentMethod.expirationMonth
            || !paymentMethod.expirationYear
        ) {
            setSnackbarSeverity("warning");
            setSnackbarMessage("Es necesario capturar la información de pago");
            setOpenSnackbar(true);

            return;
        }

        if (onPay) {
            onPay();
        }
    }

    return (
        <Box>
            <Typography variant="h3" color="primary">
                Datos de pago
            </Typography>
            <Grid container columns={2} spacing={2}>
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
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="cardNumber"
                            name="cardNumber"
                            type={'text'}
                            inputProps={{ style: { fontSize: 16 } }}
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            value={paymentMethod.cardNumber}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Fecha de venicmiento
                    </Typography>
                    <Grid container columns={2} spacing={2}>
                        <Grid size={1}>
                            <DatePicker
                                views={['month']}
                                format="MM"
                                value={
                                    paymentMethod.expirationMonth
                                        ? new Date(2025, paymentMethod.expirationMonth - 1, 1)
                                        : null
                                }
                                onChange={(date) => {
                                    if (date) {
                                        setPaymentMethod(prev => ({
                                            ...prev,
                                            expirationMonth: date.getMonth() + 1
                                        }));
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={1}>
                            <DatePicker
                                views={['year']}
                                format="yyyy"
                                value={
                                    paymentMethod.expirationYear
                                        ? new Date(paymentMethod.expirationYear, 0, 1)
                                        : null
                                }
                                onChange={(date) => {
                                    if (date) {
                                        setPaymentMethod(prev => ({
                                            ...prev,
                                            expirationYear: date.getFullYear()
                                        }));
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }} alignContent={"end"}>
                    <Image
                        src="/assets/icons/payment/payments.svg"
                        alt="Payment"
                        height={26}
                        width={147}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-muted)' }} />

            <Grid container columns={6} spacing={2}>
                <Grid size={1} offset={4} textAlign="right">
                    <Typography variant="subtitle1" color="primary">
                        Subtotal
                    </Typography>
                </Grid>
                <Grid size={1} textAlign="right">
                    <Typography variant="subtitle1" fontWeight={400} color="text">
                        {formatCurrency(subtotal, currency)}
                    </Typography>
                </Grid>
                <Grid size={1} offset={4} textAlign="right">
                    <Typography variant="subtitle1" color="primary">
                        Impuestos
                    </Typography>
                </Grid>
                <Grid size={1} textAlign="right">
                    <Typography variant="subtitle1" fontWeight={400} color="text">
                        {formatCurrency(taxes, currency)}
                    </Typography>
                </Grid>
                <Grid size={1} offset={4} textAlign="right">
                    <Typography variant="subtitle1" color="primary">
                        Total
                    </Typography>
                </Grid>
                <Grid size={1} textAlign="right">
                    <Typography variant="subtitle1" fontWeight={400} color="text">
                        {formatCurrency(total, currency)}
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderWidth: 1, borderColor: 'var(--color-text-muted)' }} />

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                    required
                    control={
                        <Checkbox
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                    }
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
        </Box>
    );
}