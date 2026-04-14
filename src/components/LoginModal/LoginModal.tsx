"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, AlertColor, Backdrop, Box, Button, CircularProgress, Dialog, FormControl, IconButton, Input, InputAdornment, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { closeLoginModal } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

import styles from "./LoginModal.module.scss";

export default function LoginModal() {
    const dispatch = useAppDispatch();
    const open = useAppSelector((state: RootState) => state.ui.loginModalOpen);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const status = useAppSelector(state => state.auth.status);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success')

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = async () => {
        const result = await dispatch(login({ username, password }));

        if (login.fulfilled.match(result)) {
            dispatch(closeLoginModal());
            setAlertSeverity("success");
            setAlertMessage("Sesión iniciada");
            setAlertOpen(true);
        }
        else if (login.rejected.match(result)) {
            const message =
                result.payload || result.error.message || "Error al iniciar sesión";

            setAlertSeverity("error");
            setAlertMessage(message);
            setAlertOpen(true);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => dispatch(closeLoginModal())}
            slotProps={{ paper: { className: styles.modal } }}>
            <Box className={styles.content}>
                <Box className={styles.topImage} mt={2}>
                    <Image
                        src={`/assets/logo-gold-dark.svg`}
                        alt="Evento"
                        fill
                        className={styles.image}
                    />
                </Box>

                <Typography variant="h2" fontWeight={600} color="primary" mt={4}>
                    Inicia sesión
                </Typography>

                <Box className={styles.inputContainer}>
                    <Typography variant="bodyLg" mb={1} color={'text'} mt={2}>
                        Correo o número de teléfono
                    </Typography>
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="email"
                            type={'text'}
                            className={styles.inputCustom}
                            inputProps={{
                                style: {
                                    textAlign: 'center',
                                    fontSize: 16
                                }
                            }}
                            placeholder="usuario@correo.com"
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormControl>
                </Box>

                <Box mt={3} className={styles.inputContainer}>
                    <Typography variant="bodyLg" mb={1} color={'text'}>
                        Contraseña
                    </Typography>
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className={styles.inputCustom}
                            inputProps={{
                                style: {
                                    textAlign: 'center',
                                    fontSize: 16
                                }
                            }}
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
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

                <Button variant="text" color={'secondary'}>
                    <Typography variant={'bodyLg'} color={'text'} sx={{ textDecoration: 'underline' }}>
                        ¿Olvidaste tu contraseña?
                    </Typography>
                </Button>
                <Box className={styles.actionContainer} mt={5}>
                    <Button
                        variant="contained"
                        onClick={handleLogin}
                        disabled={status === "loading"}
                        sx={{ paddingTop: 1.2, paddingBottom: 1.2 }}
                    >
                        <Typography variant="body1" color={colors.light.neutral}>
                            Iniciar sesión
                        </Typography>
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ marginTop: 1.5, paddingTop: 1.2, paddingBottom: 1.2 }}
                    >
                        <Typography variant="body1" color={colors.light.neutral}>
                            Crea una cuenta
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
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={status === "loading"}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Dialog>
    );
}