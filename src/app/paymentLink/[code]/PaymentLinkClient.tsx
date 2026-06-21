"use client";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Payment, {
  PAYMENT_LINK_SS_KEY,
  PaymentLinkCheckoutContext,
} from "@/app/booking/components/Payment/Payment";
import { OrderDTO } from "@/models/order.dto";
import { confirmPaymentLinkCheckoutAsync } from "@/services/paymentLinkService";

interface PaymentLinkClientProps {
  code: string;
  order: OrderDTO;
}

export default function PaymentLinkClient({ code, order }: PaymentLinkClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmingRef = useRef(false);

  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    const resultIndicator = searchParams.get("resultIndicator");
    if (!resultIndicator) return;
    if (confirmingRef.current) return;
    confirmingRef.current = true;

    setConfirmingPayment(true);

    const rawCtx = sessionStorage.getItem(PAYMENT_LINK_SS_KEY);
    if (!rawCtx) {
      setConfirmError(
        "No se encontró el contexto de pago. Por favor contacta a soporte si se realizó algún cargo.",
      );
      return;
    }

    let ctx: PaymentLinkCheckoutContext;
    try {
      ctx = JSON.parse(rawCtx) as PaymentLinkCheckoutContext;
    } catch {
      setConfirmError("Error al leer el contexto de pago. Por favor contacta a soporte.");
      return;
    }

    confirmPaymentLinkCheckoutAsync(ctx.paymentLinkCode, {
      orderRefId: ctx.orderRefId,
      resultIndicator,
      successIndicator: ctx.successIndicator,
    })
      .then((orderId) => {
        sessionStorage.removeItem(PAYMENT_LINK_SS_KEY);
        router.push(`/account/tickets/order/${orderId}/success`);
      })
      .catch((err: unknown) => {
        let msg = "Error al confirmar el pago.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.detail
            ?? err.response?.data?.title
            ?? err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setConfirmError(msg);
      });
  }, []);

  if (confirmingPayment) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        gap={3}
        px={2}
      >
        {!confirmError ? (
          <>
            <CircularProgress size={48} color="primary" />
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Confirmando tu pago, por favor espera…
            </Typography>
          </>
        ) : (
          <Alert severity="error" sx={{ maxWidth: 520 }}>
            <Typography variant="body1" fontWeight={600} mb={0.5}>
              No se pudo confirmar el pago
            </Typography>
            <Typography variant="body2">{confirmError}</Typography>
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Paper elevation={3} className="paperCard">
      <Payment
        paymentLinkCode={code}
        subtotal={order.subTotal}
        fees={order.totalFees}
        taxes={order.totalTaxes}
        discount={order.discount}
        total={order.total}
        currency={order.currency}
      />
    </Paper>
  );
}
