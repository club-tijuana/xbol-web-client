"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useRouter } from "next/navigation";

import Loader from "@/components/Loader/Loader";
import {
  buildCheckoutClientContact,
  isCheckoutClientContactComplete,
} from "@/helpers/checkoutContact";
import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { initiateCheckout } from "@/services/evoPaymentService";
import { initiatePaymentLinkCheckoutAsync } from "@/services/paymentLinkService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearHoldToken } from "@/store/slices/bookingFlowSlice";

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
export const PAYMENT_LINK_SS_KEY = "evo_pl_checkout_v1";

export interface PaymentLinkCheckoutContext {
  paymentLinkCode: string;
  orderRefId: string;
  successIndicator: string;
}

export interface CheckoutContext {
  localOrderId: number;
  orderRefId: string;
  successIndicator: string;
  sessionId: string;
  scheduleId: number;
  bundleId: number;
  seatKeys: string[];
  timestamp: number;
}

const EVO_CHECKOUT_JS =
  "https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js";

export default function Payment({
  subtotal,
  fees,
  taxes,
  total,
  currency,
  showTotals = true,
  paymentLinkCode,
  scheduleId,
  bundleId,
}: PaymentProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paying, setPaying] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();

  const accountInfo = useAppSelector((store) => store.auth.user);
  const holdTokenState = useAppSelector(
    (store) => store.bookingFlow.holdTokenObj,
  );
  const selectedSeats = useAppSelector(
    (store) => store.bookingFlow.selectedSeats,
  );
  const clientContact = useAppSelector(
    (store) => store.bookingFlow.clientContact,
  );
  const bookingMode = useAppSelector((store) => store.bookingFlow.bookMode);
  const renovationType = useAppSelector(
    (store) => store.bookingFlow.renovationType,
  );
  const referenceOrderId = useAppSelector(
    (store) => store.bookingFlow.referenceOrderId,
  );

  const handlePay = async () => {
    if (!acceptedTerms) {
      snackbar.show(
        "Es necesario aceptar las condiciones de compra",
        "warning",
      );
      return;
    }

    if (paymentLinkCode) {
      if (paying) return;
      setPaying(true);
      try {
        const returnUrl = `${window.location.origin}${window.location.pathname}?source=evo`;
        const result = await initiatePaymentLinkCheckoutAsync(paymentLinkCode, {
          returnUrl,
          currency: currency ?? "MXN",
        });

        const ctx: PaymentLinkCheckoutContext = {
          paymentLinkCode,
          orderRefId: result.orderRefId,
          successIndicator: result.successIndicator,
        };
        sessionStorage.setItem(PAYMENT_LINK_SS_KEY, JSON.stringify(ctx));

        const script = document.createElement("script");
        script.src = EVO_CHECKOUT_JS;
        script.async = false;

        script.onerror = () => {
          setPaying(false);
          sessionStorage.removeItem(PAYMENT_LINK_SS_KEY);
          snackbar.show(
            "No se pudo cargar la página de pago seguro. Intenta nuevamente.",
            "error",
          );
        };

        script.onload = () => {
          window.Checkout.configure({ session: { id: result.sessionId } });
          window.Checkout.showPaymentPage();
        };

        document.body.appendChild(script);
      } catch (err: unknown) {
        setPaying(false);
        sessionStorage.removeItem(PAYMENT_LINK_SS_KEY);
        const msg = err instanceof Error ? err.message : "Error al iniciar el pago.";
        snackbar.show(msg, "error");
      }
      return;
    }

    if (!selectedSeats || selectedSeats.length === 0) {
      snackbar.show("No hay asientos seleccionados.", "error");
      return;
    }

    const requiresHoldToken =
      bookingMode !== "renovateSeason" || renovationType === "changeSeats";

    if (!holdTokenState?.token && requiresHoldToken) {
      snackbar.show(
        "La reserva de asientos expiró. Por favor vuelve a seleccionar tus asientos.",
        "warning",
      );
      return;
    }

    if (
      holdTokenState?.status === "expired" ||
      holdTokenState?.status === "manualExpired"
    ) {
      snackbar.show(
        "La reserva de asientos expiró. Por favor vuelve a seleccionar tus asientos.",
        "warning",
      );
      return;
    }

    if (!scheduleId && !bundleId) {
      snackbar.show(
        "Error interno: no se encontró el evento. Recarga la página.",
        "error",
      );
      return;
    }

    /*         if (!bundleId) {
                    snackbar.show("Error interno: no se encontró la temporada. Recarga la página.", "error");
                } */

    const checkoutContact = buildCheckoutClientContact(accountInfo, clientContact);

    if (!isCheckoutClientContactComplete(checkoutContact)) {
      snackbar.show(
        "Es necesario capturar la información de contacto del cliente.",
        "warning",
      );
      return;
    }

    if (paying) return;
    setPaying(true);

    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}?source=evo`;

      const result = await initiateCheckout({
        eventScheduleId: scheduleId,
        bundleId: bundleId,
        relatedOrderId: bundleId ? referenceOrderId : undefined,
        holdToken: holdTokenState?.token ?? "",
        seats: selectedSeats.map((s) => ({
          seatKey: s.seatKey,
          priceListItemId: s.priceListItemId,
        })),
        clientContact: checkoutContact,
        returnUrl,
        currency: currency ?? "MXN",
      }, accountInfo?.token);

      const ctx: CheckoutContext = {
        localOrderId: result.localOrderId,
        orderRefId: result.orderRefId,
        successIndicator: result.successIndicator,
        sessionId: result.sessionId,
        scheduleId: scheduleId ?? 0,
        bundleId: bundleId ?? 0,
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
        snackbar.show(
          "No se pudo cargar la página de pago seguro. Intenta nuevamente.",
          "error",
        );
      };

      script.onload = () => {
        window.Checkout.configure({ session: { id: result.sessionId } });
        window.Checkout.showPaymentPage();
      };

      document.body.appendChild(script);
    } catch (err: unknown) {
      setPaying(false);
      sessionStorage.removeItem(CHECKOUT_SS_KEY);
      if (requiresHoldToken) {
        dispatch(clearHoldToken());
      }
      const msg =
        err instanceof Error ? err.message : "Error al iniciar el pago.";
      snackbar.show(msg, "error");
    }
  };

  return (
    <Box>
      <Typography variant="h4" color="primary">
        Datos de pago
      </Typography>

      <Typography variant="body2" color="text.secondary" mt={1}>
        Serás redirigido a la página de pago seguro de EVO Payments para
        completar tu compra.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {showTotals && (
        <Box>
          {subtotal !== undefined && subtotal > 0 && (
            <Grid container columns={4} spacing={3}>
              <Grid size={1} offset={2} textAlign="right">
                <Typography variant="body2">Subtotal</Typography>
              </Grid>
              <Grid size={1} textAlign="right">
                <Typography variant="body1" color="secondary">
                  {formatCurrency(subtotal, currency)}
                </Typography>
              </Grid>
            </Grid>
          )}
          {fees !== undefined && fees > 0 && (
            <Grid container columns={4} spacing={3} mt={1}>
              <Grid size={1} offset={2} textAlign="right">
                <Typography variant="body2">Comisiones</Typography>
              </Grid>
              <Grid size={1} textAlign="right">
                <Typography variant="body1" color="secondary">
                  {formatCurrency(fees, currency)}
                </Typography>
              </Grid>
            </Grid>
          )}
          {taxes !== undefined && taxes > 0 && (
            <Grid container columns={4} spacing={3} mt={1}>
              <Grid size={1} offset={2} textAlign="right">
                <Typography variant="body2">Impuestos</Typography>
              </Grid>
              <Grid size={1} textAlign="right">
                <Typography variant="body1" color="secondary">
                  {formatCurrency(taxes, currency)}
                </Typography>
              </Grid>
            </Grid>
          )}
          <Grid container columns={4} spacing={3} mt={1}>
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
                href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/legal/#terminos`}
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
          {paying ? "Procesando..." : paymentLinkCode ? "Confirmar pago" : "Ir a pago seguro"}
        </Button>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={5000}
      >
        <Alert
          onClose={snackbar.close}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Loader isLoading={paying} />
    </Box>
  );
}
