"use client";

import { Alert, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthDto } from "@/models/auth.dto";
import { refreshEmailVerificationStatus, sendVerificationEmail } from "@/services/authService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

function isEmailVerified(user: AuthDto | null): boolean {
    return user?.emailVerified === true || user?.verificationStatus === "verified";
}

export default function EmailVerificationStatus() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(state => state.auth.user);
    const [errorMessage, setErrorMessage] = useState("");
    const [resent, setResent] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const email = user?.email ?? user?.username;
    const verified = isEmailVerified(user);

    const handleResend = async () => {
        setErrorMessage("");
        setResent(false);
        setIsResending(true);

        try {
            await sendVerificationEmail();
            setResent(true);
        } catch {
            setErrorMessage("No pudimos reenviar el correo de verificación.");
        } finally {
            setIsResending(false);
        }
    };

    const handleRefresh = async () => {
        if (!user) {
            return;
        }

        setErrorMessage("");
        setIsChecking(true);

        try {
            const refreshedUser = await refreshEmailVerificationStatus(user);
            dispatch(setUser(refreshedUser));

            if (isEmailVerified(refreshedUser)) {
                router.push("/");
                return;
            }

            setErrorMessage("Tu correo todavía aparece pendiente de verificación.");
        } catch {
            setErrorMessage("No pudimos actualizar el estado de verificación.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <Paper
            component="section"
            elevation={3}
            sx={{
                backgroundColor: "white",
                borderRadius: 2,
                maxWidth: 560,
                mx: "auto",
                p: { xs: 3, sm: 5 },
                width: "100%",
            }}
        >
            <Stack spacing={3}>
                <Typography component="h1" variant="h3" color="primary" fontWeight={600}>
                    Verifica tu correo
                </Typography>

                {!user &&
                    <Alert severity="warning" variant="filled">
                        Inicia sesión para consultar la verificación de tu correo.
                    </Alert>
                }

                {user && verified &&
                    <Alert severity="success" variant="filled">
                        Correo verificado.
                    </Alert>
                }

                {user && !verified &&
                    <>
                        <Typography>
                            Te enviamos un correo de verificación a {email}.
                        </Typography>

                        <Typography color="text.secondary">
                            Revisa tu bandeja de entrada y confirma el enlace de Firebase para activar el acceso completo.
                        </Typography>
                    </>
                }

                {resent &&
                    <Alert severity="success" variant="filled">
                        Enviamos otro correo de verificación.
                    </Alert>
                }

                {errorMessage &&
                    <Alert severity="error" variant="filled">
                        {errorMessage}
                    </Alert>
                }

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {user && !verified &&
                        <>
                            <Button
                                type="button"
                                variant="contained"
                                disabled={isChecking}
                                onClick={handleRefresh}
                            >
                                {isChecking
                                    ? <CircularProgress color="inherit" size={24} />
                                    : "Ya verifiqué"
                                }
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                disabled={isResending}
                                onClick={handleResend}
                            >
                                {isResending
                                    ? <CircularProgress color="inherit" size={24} />
                                    : "Reenviar correo"
                                }
                            </Button>
                        </>
                    }

                    {(!user || verified) &&
                        <Button type="button" variant="contained" onClick={() => router.push("/")}>
                            Continuar
                        </Button>
                    }
                </Stack>
            </Stack>
        </Paper>
    );
}
