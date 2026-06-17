import { useEffect, useRef } from "react";

import { SessionResponse } from "@/models/evo-payments/session-response";

interface UseThreeDSOptions {
    session: SessionResponse | undefined;
    scriptLoaded: boolean;
    onAuthComplete: (authData: any) => void;
    onError: (message: string) => void;
}

export function useThreeDS({ session, scriptLoaded, onAuthComplete, onError }: UseThreeDSOptions) {
    const onAuthCompleteRef = useRef(onAuthComplete);
    const onErrorRef = useRef(onError);
    onAuthCompleteRef.current = onAuthComplete;
    onErrorRef.current = onError;

    useEffect(() => {
        const ThreeDS = (window as any).ThreeDS;
        if (!session || !scriptLoaded || !ThreeDS) return;

        ThreeDS.configure({
            merchantId: session.merchant,
            sessionId: session.session.id,
            containerId: "3DSUI",
            callback: () => {},
            configuration: {
                userLanguage: "es-MX",
                wsVersion: 100
            }
        });
    }, [session, scriptLoaded]);

    const initiateFlow = () => {
        const ThreeDS = (window as any).ThreeDS;
        if (!ThreeDS || !session) return;

        const { orderRefId, transactionRefId } = session;

        ThreeDS.initiateAuthentication(
            orderRefId,
            transactionRefId,
            (data: any) => {
                if (data?.error) {
                    onErrorRef.current("Error en la autenticación 3DS.");
                    return;
                }

                switch (data.gatewayRecommendation) {
                    case "PROCEED":
                        ThreeDS.authenticatePayer(
                            orderRefId,
                            transactionRefId,
                            (authData: any) => {
                                if (!authData.error) {
                                    onAuthCompleteRef.current(authData);
                                } else {
                                    onErrorRef.current("Error al autenticar al pagador.");
                                }
                            },
                            { fullScreenRedirect: false }
                        );
                        break;

                    case "DO_NOT_PROCEED":
                        onErrorRef.current("Transacción rechazada por políticas de riesgo (3DS).");
                        break;

                    default:
                        onErrorRef.current("Respuesta inesperada del servidor de autenticación.");
                        break;
                }
            },
            { sourceOfFunds: { type: "CARD" } }
        );
    };

    return { initiateFlow };
}
