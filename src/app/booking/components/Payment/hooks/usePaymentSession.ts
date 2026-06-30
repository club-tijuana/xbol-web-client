import { useEffect, useRef } from "react";

import { SessionResponse } from "@/models/evo-payments/session-response";

export function usePaymentSession(
  session: SessionResponse | undefined,
  scriptLoaded: boolean,
  onFormSessionUpdate: (response: any) => void,
) {
  const callbackRef = useRef(onFormSessionUpdate);
  callbackRef.current = onFormSessionUpdate;

  useEffect(() => {
    if (!session || !scriptLoaded || !window.PaymentSession) return;

    window.PaymentSession.configure({
      session: session.session.id,
      fields: {
        card: {
          number: "#cardNumber",
          securityCode: "#securityCode",
          expiryMonth: "#expiryMonth",
          expiryYear: "#expiryYear",
        },
      },
      callbacks: {
        initialized: () => {},
        formSessionUpdate: (response: any) => callbackRef.current(response),
      },
    });
  }, [session, scriptLoaded]);

  const updateForm = () => window.PaymentSession?.updateSessionFromForm("card");

  return { updateForm };
}
