"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { ConfirmationResult } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthIdentifierInput } from "@/components/AuthIdentifierField/AuthIdentifierField";
import {
  defaultAuthPhoneCountryCode,
  getPhoneAuthIdentifier,
  isPhoneLikeAuthIdentifier,
  normalizeAuthIdentifier,
} from "@/helpers/authIdentifier";
import {
  isUnlinkedClientProfileError,
  loginPhone,
  sendPasswordReset,
  sendPhoneLoginCode,
} from "@/services/authService";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, setUser } from "@/store/slices/authSlice";
import { closeLoginModal } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

import styles from "./LoginModal.module.scss";

export default function LoginModal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((state: RootState) => state.ui.loginModalOpen);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierCountryCode, setIdentifierCountryCode] = useState<string>(
    defaultAuthPhoneCountryCode,
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneConfirmation, setPhoneConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetDialogOpen, setPasswordResetDialogOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const status = useAppSelector((state) => state.auth.status);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const normalizedPhoneIdentifier = getPhoneAuthIdentifier(
    identifier,
    identifierCountryCode,
  );
  const isPhoneIdentifier = normalizedPhoneIdentifier !== null;
  const isPhoneLikeIdentifier = isPhoneLikeAuthIdentifier(identifier);
  const isPhoneFlow = isPhoneIdentifier || phoneConfirmation !== null;
  const isLoading =
    status === "loading" || phoneLoading || passwordResetLoading;
  const shouldShowSmsCode = phoneConfirmation !== null;
  const isLoginDisabled =
    isLoading ||
    (isPhoneLikeIdentifier && !isPhoneIdentifier) ||
    (isPhoneIdentifier && (!phoneConfirmation || !verificationCode.trim()));
  const registrationIdentifierCountryCode = normalizeAuthIdentifier(
    identifier,
  ).startsWith("+")
    ? undefined
    : identifierCountryCode || undefined;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const resetPhoneCodeState = () => {
    setPhoneConfirmation(null);
    setVerificationCode("");
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const finishLogin = (
    emailVerified?: boolean,
    verificationStatus?: string,
  ) => {
    dispatch(closeLoginModal());

    if (emailVerified === false && verificationStatus === "pending") {
      router.push("/register/verify-email");
      return;
    }

    setAlertSeverity("success");
    setAlertMessage("Sesión iniciada");
    setAlertOpen(true);
  };

  const handleEmailLogin = async () => {
    const result = await dispatch(
      login({ username: normalizeAuthIdentifier(identifier), password }),
    );

    if (login.fulfilled.match(result)) {
      finishLogin(
        result.payload.emailVerified,
        result.payload.verificationStatus,
      );
    } else if (login.rejected.match(result)) {
      const message =
        result.payload || result.error.message || "Error al iniciar sesión";

      setAlertSeverity("error");
      setAlertMessage(message);
      setAlertOpen(true);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phoneConfirmation) {
      setAlertSeverity("error");
      setAlertMessage("Envía el código SMS antes de iniciar sesión");
      setAlertOpen(true);
      return;
    }

    setPhoneLoading(true);
    try {
      const user = await loginPhone(phoneConfirmation, verificationCode);
      dispatch(setUser(user));
      if (user.onboardingStatus === "unlinked") {
        const registrationParams = new URLSearchParams({
          identifier: normalizeAuthIdentifier(identifier),
        });
        if (registrationIdentifierCountryCode) {
          registrationParams.set(
            "identifierCountryCode",
            registrationIdentifierCountryCode,
          );
        }

        dispatch(closeLoginModal());
        router.push(`/register?${registrationParams.toString()}`);
        return;
      }

      finishLogin(user.emailVerified, user.verificationStatus);
    } catch (error) {
      if (isUnlinkedClientProfileError(error)) {
        const registrationParams = new URLSearchParams({
          identifier: normalizeAuthIdentifier(identifier),
        });
        if (registrationIdentifierCountryCode) {
          registrationParams.set(
            "identifierCountryCode",
            registrationIdentifierCountryCode,
          );
        }

        dispatch(closeLoginModal());
        router.push(`/register?${registrationParams.toString()}`);
        return;
      }

      setAlertSeverity("error");
      setAlertMessage(
        error instanceof Error ? error.message : "Error al iniciar sesión",
      );
      setAlertOpen(true);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleLogin = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (isLoading) {
      return;
    }

    if (isPhoneLikeIdentifier && !isPhoneIdentifier) {
      setAlertSeverity("error");
      setAlertMessage("Selecciona el país e ingresa un teléfono válido");
      setAlertOpen(true);
      return;
    }

    if (isPhoneIdentifier) {
      await handlePhoneLogin();
      return;
    }

    await handleEmailLogin();
  };

  const handleSendPhoneCode = async () => {
    if (!normalizedPhoneIdentifier) {
      setAlertSeverity("error");
      setAlertMessage("Selecciona el país e ingresa un teléfono válido");
      setAlertOpen(true);
      return;
    }

    setPhoneLoading(true);
    try {
      const confirmation = await sendPhoneLoginCode(
        normalizedPhoneIdentifier,
        "login-phone-recaptcha",
      );
      setPhoneConfirmation(confirmation);
      setAlertSeverity("success");
      setAlertMessage("Código enviado");
      setAlertOpen(true);
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error instanceof Error ? error.message : "Error al enviar código SMS",
      );
      setAlertOpen(true);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleRegister = () => {
    dispatch(closeLoginModal());
    router.push("/register");
  };

  const handleForgotPassword = () => {
    setPasswordResetDialogOpen(true);
  };

  const handlePasswordResetSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const email = normalizeAuthIdentifier(passwordResetEmail);
    if (!email || !email.includes("@")) {
      setAlertSeverity("error");
      setAlertMessage(
        "Ingresa tu correo electrónico para restablecer tu contraseña",
      );
      setAlertOpen(true);
      return;
    }

    setPasswordResetLoading(true);
    try {
      await sendPasswordReset(email);
      setPasswordResetDialogOpen(false);
      setAlertSeverity("success");
      setAlertMessage("Te enviamos un correo para restablecer tu contraseña");
      setAlertOpen(true);
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error instanceof Error
          ? error.message
          : "Error al enviar correo de recuperación",
      );
      setAlertOpen(true);
    } finally {
      setPasswordResetLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeLoginModal())}
      slotProps={{ paper: { className: styles.modal } }}
    >
      <Box component="form" className={styles.content} onSubmit={handleLogin}>
        <Box className={styles.topImage} mt={2}>
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/logo-gold-dark.svg`}
            alt="Evento"
            fill
            className={styles.image}
          />
        </Box>

        <Typography variant="h2" fontWeight={600} color="primary" mt={4}>
          Inicia sesión
        </Typography>

        <Box
          sx={{
            width: {
              xs: "90%",
              sm: "60%",
            },
          }}
          className={styles.inputContainer}
        >
          <Typography variant="caption" mb={1} color={"text"}>
            Correo electrónico o teléfono
          </Typography>
          <AuthIdentifierInput
            id="login-identifier"
            value={identifier}
            countryCode={identifierCountryCode}
            onCountryCodeChange={(value) => {
              setIdentifierCountryCode(value);
              resetPhoneCodeState();
            }}
            onValueChange={(value) => {
              setIdentifier(value);
              resetPhoneCodeState();
            }}
            className={styles.inputCustom}
            inputProps={{
              "aria-label": "Correo electrónico o teléfono",
              style: {
                textAlign: "center",
                fontSize: 16,
              },
            }}
            sx={{
              backgroundColor: "white",
              "&:after": {
                borderBottom: "2px solid var(--color-text-primary)",
              },
            }}
            fullWidth
          />
        </Box>

        {!isPhoneFlow && (
          <>
            <Box
              mt={3}
              sx={{
                width: {
                  xs: "90%",
                  sm: "60%",
                },
              }}
              className={styles.inputContainer}
            >
              <Typography variant="caption" mb={1} color={"text"}>
                Contraseña
              </Typography>
              <FormControl fullWidth variant="filled">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.inputCustom}
                  inputProps={{
                    "aria-label": "Contraseña",
                    style: {
                      textAlign: "center",
                      fontSize: 16,
                    },
                  }}
                  sx={{
                    backgroundColor: "white",
                    "&:after": {
                      borderBottom: "2px solid var(--color-text-primary)",
                    },
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="start"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Box>
          </>
        )}

        {isPhoneIdentifier && (
          <>
            {!phoneConfirmation && (
              <Button
                type="button"
                variant="outlined"
                disabled={isLoading || !normalizedPhoneIdentifier}
                onClick={handleSendPhoneCode}
                sx={{ mt: 2 }}
              >
                Enviar código
              </Button>
            )}
            {shouldShowSmsCode && (
              <Box
                mt={3}
                className={styles.inputContainer}
                sx={{
                  width: {
                    xs: "90%",
                    sm: "60%",
                  },
                }}
              >
                <Typography variant="caption" mb={1} color={"text"}>
                  Código SMS
                </Typography>
                <FormControl fullWidth variant="filled">
                  <Input
                    id="sms-code"
                    type="text"
                    value={verificationCode}
                    className={styles.inputCustom}
                    inputProps={{
                      "aria-label": "Código SMS",
                      style: {
                        textAlign: "center",
                        fontSize: 16,
                      },
                    }}
                    sx={{
                      backgroundColor: "white",
                      "&:after": {
                        borderBottom: "2px solid var(--color-text-primary)",
                      },
                    }}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </FormControl>
              </Box>
            )}
            <div id="login-phone-recaptcha" />
          </>
        )}

        <Button
          type="button"
          variant="text"
          color={"secondary"}
          disabled={isLoading}
          onClick={handleForgotPassword}
        >
          <Typography
            variant="body1"
            color={"text"}
            sx={{ textDecoration: "underline" }}
          >
            ¿Olvidaste tu contraseña?
          </Typography>
        </Button>
        <Button
          type="button"
          variant="text"
          color={"secondary"}
          onClick={handleRegister}
        >
          <Typography
            variant="body1"
            color={"text"}
            sx={{ textDecoration: "underline" }}
          >
            Crear cuenta
          </Typography>
        </Button>
        <Box
          className={styles.actionContainer}
          sx={{
            width: {
              xs: "90%",
              sm: "60%",
            },
          }}
          mt={5}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isLoginDisabled}
            sx={{ paddingTop: 1.2, paddingBottom: 1.2 }}
          >
            <Typography variant="body1" color={colors.text.neutral}>
              Iniciar sesión
            </Typography>
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={passwordResetDialogOpen}
        onClose={() => setPasswordResetDialogOpen(false)}
      >
        <Box component="form" onSubmit={handlePasswordResetSubmit}>
          <DialogTitle>Recuperar contraseña</DialogTitle>
          <DialogContent>
            <TextField
              label="Correo de recuperación"
              value={passwordResetEmail}
              onChange={(event) => setPasswordResetEmail(event.target.value)}
              type="email"
              fullWidth
              required
              variant="filled"
              sx={{ mt: 1, minWidth: { xs: 280, sm: 360 } }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              onClick={() => setPasswordResetDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={passwordResetLoading}>
              Enviar recuperación
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Dialog>
  );
}
