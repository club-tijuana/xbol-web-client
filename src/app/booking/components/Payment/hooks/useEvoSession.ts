import { useEffect, useRef, useState } from "react";

import { SessionResponse } from "@/models/evo-payments/session-response";
import { createSession } from "@/services/evoPaymentService";
import { useAppDispatch } from "@/store/hooks";
import { setEvoReferences } from "@/store/slices/bookingFlowSlice";

export function useEvoSession() {
    const dispatch = useAppDispatch();
    const [session, setSession] = useState<SessionResponse>();
    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    useEffect(() => {
        if (session || isFetching.current) return;

        const fetchSession = async () => {
            isFetching.current = true;
            setLoading(true);
            try {
                const response = await createSession();
                if (response) {
                    response.orderRefId = response.orderRefId.replace(/-/g, "");
                    response.transactionRefId = response.transactionRefId.replace(/-/g, "");
                    dispatch(setEvoReferences({
                        sessionId: response.session.id,
                        orderRefId: response.orderRefId,
                        transactionRefId: response.transactionRefId
                    }));
                    setSession(response);
                }
            } catch (error) {
                console.error("Error al crear sesión Evo:", error);
            } finally {
                isFetching.current = false;
                setLoading(false);
            }
        };

        fetchSession();
    }, [dispatch]);

    return { session, loading };
}
