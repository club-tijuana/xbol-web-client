"use client";

import { Alert, Box, Button, Checkbox, Divider, FormControlLabel, Grid, Snackbar, Typography } from "@mui/material";
import { useState } from "react";

import Loader from "@/components/Loader/Loader";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { initiateCheckout } from "@/services/evoPaymentService";
import { useAppSelector } from "@/store/hooks";

import { useSnackbar } from "./hooks/useSnackbar";
import { PaymentProps } from "./Payment.type";

declare global {
    interface Window {
        Checkout: {
            configure: (config: { session: { id: string } }) => void;
            showPaymentPage: () => void;
        };
    }
}

export const CHECKOUT_SS_KEY = "evo_hc_booking_v1";

export interface CheckoutContext {
    localOrderId: number;
    orderRefId: string;
    successIndicator: string;
    sessionId: string;
    scheduleId: number;
    seatKeys: string[];
    timestamp: number;
}

const EVO_CHECKOUT_JS =
    "https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js";

export default function Payment({
    total,
    currency,
    showTotals = true,
    scheduleId,
}: PaymentProps) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [paying, setPaying] = useState(false);

    const snackbar = useSnackbar();

    const accountInfo = useAppSelector((store) => store.auth.user);
    const holdTokenState = useAppSelector((store) => store.bookingFlow.holdTokenObj);
    const selectedSeats = useAppSelector((store) => store.bookingFlow.selectedSeats);
    const clientContact = useAppSelector((store) => store.bookingFlow.clientContact);

    const handlePay = async () => {
        if (!acceptedTerms) {
            snackbar.show("Es necesario aceptar las condiciones de compra", "warning");
            return;
        }

        if (!selectedSeats || selectedSeats.length === 0) {
            snackbar.show("No hay asientos seleccionados.", "error");
            return;
        }

        if (!holdTokenState?.token) {
            snackbar.show("La reserva de asientos expiró. Por favor vuelve a seleccionar tus asientos.", "warning");
            return;
        }

        if (holdTokenState.status === "expired" || holdTokenState.status === "manualExpired") {
            snackbar.show("La reserva de asientos expiró. Por favor vuelve a seleccionar tus asientos.", "warning");
            return;
        }

        if (!scheduleId) {
            snackbar.show("Error interno: no se encontró el evento. Recarga la página.", "error");
            return;
        }

        let contactEmail = "";
        let contactFullName = "";
        let contactPhone = "";

        if (accountInfo) {
            contactEmail = accountInfo.email ?? "";
            contactFullName = `${accountInfo.firstName ?? ""} ${accountInfo.lastName ?? ""}`.trim();
            contactPhone = accountInfo.phoneNumber ?? "";
        } else if (clientContact) {
            contactEmail = clientContact.email ?? "";
            contactFullName =
                clientContact.fullName?.trim() ||
                `${clientContact.firstName ?? ""} ${clientContact.lastName ?? ""}`.trim();
            contactPhone = clientContact.phoneNumber ?? "";
        }

        if (!contactEmail) {
            snackbar.show("Es necesario capturar la información del cliente.", "warning");
            return;
        }

        if (paying) return;
        setPaying(true);

        try {
            const returnUrl = `${window.location.origin}${window.location.pathname}`;

            const result = await initiateCheckout({
                eventScheduleId: scheduleId,
                holdToken: holdTokenState.token,
                seats: selectedSeats.map((s) => ({
                    seatKey: s.seatKey,
                    priceListItemId: s.priceListItemId,
                })),
                clientContact: {
                    email: contactEmail,
                    fullName: contactFullName,
                    phoneNumber: contactPhone,
                },
                returnUrl,
                currency: currency ?? "MXN",
            });

            const ctx: CheckoutContext = {
                localOrderId: result.localOrderId,
                orderRefId: result.orderRefId,
                successIndicator: result.successIndicator,
                sessionId: result.sessionId,
                scheduleId,
                seatKeys: selectedSeats.map((s) => s.seatKey),
                timestamp: Date.now(),
            };
            sessionStorage.setItem(CHECKOUT_SS_KEY, JSON.stringify(ctx));

            const script = document.createElement("script");
            script.src = EVO_CHECKOUT_JS;
            script.async = false;

            script.onerror = () => {
                setPaying(false);
                sessionStorage.removeItem(CHECKOUT_SS_KEY);
                snackbar.show("No se pudo cargar la página de pago seguro. Intenta nuevamente.", "error");
            };

            script.onload = () => {
                window.Checkout.configure({ session: { id: result.sessionId } });
                window.Checkout.showPaymentPage();
            };

            document.body.appendChild(script);
        } catch (err: unknown) {
            setPaying(false);
            const msg = err instanceof Error ? err.message : "Error al iniciar el pago.";
            snackbar.show(msg, "error");
        }
    };

    return (
        <Box>
            <Typography variant="h4" color="primary">
                Datos de pago
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={1}>
                Serás redirigido a la página de pago seguro de EVO Payments para completar tu compra.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {showTotals && (
                <Box>
                    <Grid container columns={4} spacing={3}>
                        <Grid size={1} offset={2} textAlign="right">
                            <Typography variant="body2">Total</Typography>
                        </Grid>
                        <Grid size={1} textAlign="right">
                            <Typography variant="body1" color="secondary">
                                {formatCurrency(total ?? 0, currency)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                </Box>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                    required
                    control={
                        <Checkbox
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                    }
                    label={
                        <span>
                            Acepto las condiciones de compra{" "}
                            <a
                                href="/legal#terminos"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                (Ver términos y condiciones)
                            </a>
                        </span>
                    }
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePay}
                    disabled={!acceptedTerms || paying}
                >
                    {paying ? "Procesando..." : "Ir a pago seguro"}
                </Button>
            </Box>

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbar.open}
                autoHideDuration={5000}
            >
                <Alert onClose={snackbar.close} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Loader isLoading={paying} />
        </Box>
    );
}
