"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, CircularProgress, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { ConfirmationResult } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AuthIdentifierField from "@/components/AuthIdentifierField/AuthIdentifierField";
import { publicEnv } from "@/config/env";
import { defaultAuthPhoneCountryCode, getPhoneAuthCountry, getPhoneAuthIdentifier, isAuthPhoneCountryCode, isPhoneLikeAuthIdentifier, normalizeAuthIdentifier } from "@/helpers/authIdentifier";
import { AUTH_SMS_RESEND_COOLDOWN_SECONDS, getSmsResendLabel } from "@/helpers/authUx";
import { getVerifiedPhoneRegistrationUser } from "@/helpers/phoneRegistrationHandoff";
import { registerPhone, resolveCurrentPhoneRegistrationUser, sendPhoneLoginCode } from "@/services/authService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register, setUser } from "@/store/slices/authSlice";
import { colors } from "@/theme/colors";

interface RegisterFormProps {
    title?: string;
}

const emailAuthEnabled = publicEnv.NEXT_PUBLIC_ENABLE_EMAIL_AUTH;

export default function RegisterForm({
    title = "Crear cuenta",
}: RegisterFormProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = useAppSelector(state => state.auth.status);
    const currentAuthUser = useAppSelector(state => state.auth.user);
    const [fullName, setFullName] = useState("");
    const [identifier, setIdentifier] = useState(() => searchParams.get("identifier") ?? "");
    const [identifierCountryCode, setIdentifierCountryCode] = useState<string>(() => {
        const requestedCountryCode = searchParams.get("identifierCountryCode");
        return requestedCountryCode && isAuthPhoneCountryCode(requestedCountryCode)
            ? requestedCountryCode
            : defaultAuthPhoneCountryCode;
    });
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [smsResendSeconds, setSmsResendSeconds] = useState(0);
    const [phoneSessionLoading, setPhoneSessionLoading] = useState(false);
    const [recoveredPhoneUser, setRecoveredPhoneUser] = useState(currentAuthUser);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const normalizedPhoneIdentifier = getPhoneAuthIdentifier(identifier, identifierCountryCode);
    const isPhoneIdentifier = normalizedPhoneIdentifier !== null;
    const isPhoneLikeIdentifier = isPhoneLikeAuthIdentifier(identifier);
    const normalizedIdentifier = normalizeAuthIdentifier(identifier);
    const requestIdentifierCountryCode = normalizedIdentifier.startsWith("+")
        ? undefined
        : identifierCountryCode || undefined;
    const verifiedPhoneUser = getVerifiedPhoneRegistrationUser(
        currentAuthUser,
        normalizedPhoneIdentifier,
    );
    const matchedVerifiedPhoneUser = verifiedPhoneUser
        ?? getVerifiedPhoneRegistrationUser(recoveredPhoneUser, normalizedPhoneIdentifier);

    useEffect(() => {
        if (!matchedVerifiedPhoneUser?.phoneNumber) {
            return;
        }

        setIdentifier(matchedVerifiedPhoneUser.phoneNumber);
        setIdentifierCountryCode(
            getPhoneAuthCountry(matchedVerifiedPhoneUser.phoneNumber) ?? defaultAuthPhoneCountryCode,
        );
    }, [matchedVerifiedPhoneUser]);

    useEffect(() => {
        if (!normalizedPhoneIdentifier || verifiedPhoneUser) {
            setRecoveredPhoneUser(null);
            return;
        }

        let cancelled = false;

        setPhoneSessionLoading(true);
        resolveCurrentPhoneRegistrationUser(normalizedPhoneIdentifier)
            .then((user) => {
                if (!cancelled) {
                    setRecoveredPhoneUser(user);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setPhoneSessionLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [normalizedPhoneIdentifier, verifiedPhoneUser]);

    useEffect(() => {
        if (smsResendSeconds <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setSmsResendSeconds((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [smsResendSeconds]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (isPhoneLikeIdentifier && !isPhoneIdentifier) {
            setErrorMessage("Selecciona el país e ingresa un teléfono válido.");
            return;
        }

        if (!emailAuthEnabled && !isPhoneIdentifier) {
            setErrorMessage("Ingresa un teléfono válido.");
            return;
        }

        if (isPhoneIdentifier) {
            if (!matchedVerifiedPhoneUser && !phoneConfirmation) {
                setErrorMessage("Envía el código SMS antes de registrarte.");
                return;
            }

            setPhoneLoading(true);
            try {
                const user = await registerPhone(
                    {
                        identifier: normalizedPhoneIdentifier,
                        identifierCountryCode: requestIdentifierCountryCode,
                        fullName,
                    },
                    phoneConfirmation,
                    verificationCode,
                    matchedVerifiedPhoneUser,
                );
                dispatch(setUser(user));
                router.push("/");
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Error al registrar teléfono");
            } finally {
                setPhoneLoading(false);
            }
            return;
        }

        if (!emailAuthEnabled) {
            return;
        }

        const result = await dispatch(register({
            identifier: normalizeAuthIdentifier(identifier),
            password,
            fullName,
        }));

        if (register.fulfilled.match(result)) {
            if (result.payload.emailVerified === false || result.payload.verificationStatus === "pending") {
                router.push("/register/verify-email");
                return;
            }

            router.push("/");
            return;
        }

        setErrorMessage(
            result.payload || result.error.message || "Error al registrar cuenta",
        );
    };

    const handleSendPhoneCode = async () => {
        setErrorMessage("");
        if (!normalizedPhoneIdentifier) {
            setErrorMessage("Selecciona el país e ingresa un teléfono válido.");
            return;
        }

        setPhoneLoading(true);
        try {
            const confirmation = await sendPhoneLoginCode(
                normalizedPhoneIdentifier,
                "register-phone-recaptcha",
            );
            setPhoneConfirmation(confirmation);
            setSmsResendSeconds(AUTH_SMS_RESEND_COOLDOWN_SECONDS);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error al enviar código SMS");
        } finally {
            setPhoneLoading(false);
        }
    };

    const isLoading = status === "loading" || phoneLoading || phoneSessionLoading;
    const shouldShowDirectPhoneControls = isPhoneIdentifier
        && !matchedVerifiedPhoneUser
        && !phoneSessionLoading;
    const isRegisterDisabled = isLoading
        || (!emailAuthEnabled && !isPhoneIdentifier)
        || (isPhoneLikeIdentifier && !isPhoneIdentifier)
        || (isPhoneIdentifier && !matchedVerifiedPhoneUser && (!phoneConfirmation || !verificationCode.trim()));

    return (
        <Paper
            component="form"
            elevation={3}
            onSubmit={handleSubmit}
            sx={{
                backgroundColor: "white",
                borderRadius: 2,
                maxWidth: 520,
                mx: "auto",
                p: { xs: 3, sm: 5 },
                width: "100%",
            }}
        >
            <Stack spacing={3}>
                <Typography component="h1" variant="h3" color="primary" fontWeight={600}>
                    {title}
                </Typography>

                {errorMessage &&
                    <Alert severity="error" variant="filled">
                        {errorMessage}
                    </Alert>
                }

                <TextField
                    label="Nombre completo"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    fullWidth
                    variant="filled"
                />

                <AuthIdentifierField
                    label={emailAuthEnabled ? "Correo electrónico o teléfono" : "Teléfono"}
                    value={identifier}
                    countryCode={identifierCountryCode}
                    onCountryCodeChange={(value) => {
                        setIdentifierCountryCode(value);
                        setPhoneConfirmation(null);
                        setVerificationCode("");
                        setSmsResendSeconds(0);
                    }}
                    onValueChange={(value) => {
                        setIdentifier(value);
                        setPhoneConfirmation(null);
                        setVerificationCode("");
                        setSmsResendSeconds(0);
                    }}
                    disabled={!!verifiedPhoneUser}
                    phoneOnly={!emailAuthEnabled}
                    required
                    fullWidth
                    variant="filled"
                />

                {emailAuthEnabled && !isPhoneIdentifier &&
                    <>
                        <TextField
                            label="Contraseña"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            variant="filled"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                type="button"
                                                aria-label={
                                                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </>
                }

                {isPhoneIdentifier && matchedVerifiedPhoneUser &&
                    <Typography variant="body2" color="text.secondary">
                        Teléfono verificado. Completa tu registro.
                    </Typography>
                }

                {shouldShowDirectPhoneControls &&
                    <>
                        {!phoneConfirmation &&
                            <Button
                                type="button"
                                variant="outlined"
                                disabled={isLoading || !normalizedPhoneIdentifier}
                                onClick={handleSendPhoneCode}
                            >
                                Enviar código
                            </Button>
                        }

                        {phoneConfirmation &&
                            <>
                                <TextField
                                    label="Código SMS"
                                    value={verificationCode}
                                    onChange={(event) => setVerificationCode(event.target.value)}
                                    required
                                    fullWidth
                                    variant="filled"
                                />
                                <Button
                                    type="button"
                                    variant="text"
                                    disabled={isLoading || smsResendSeconds > 0}
                                    onClick={handleSendPhoneCode}
                                >
                                    {getSmsResendLabel(smsResendSeconds)}
                                </Button>
                            </>
                        }

                        <div id="register-phone-recaptcha" />
                    </>
                }

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isRegisterDisabled}
                    sx={{ py: 1.3 }}
                >
                    {isLoading
                        ? <CircularProgress color="inherit" size={24} />
                        : <Typography variant="body1" color={colors.text.neutral}>Registrarme</Typography>
                    }
                </Button>
            </Stack>
        </Paper>
    );
}
