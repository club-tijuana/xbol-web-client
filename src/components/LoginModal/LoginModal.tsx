"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, AlertColor, Backdrop, Box, Button, CircularProgress, Dialog, FormControl, IconButton, Input, InputAdornment, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { login as loginService } from "@/services/authService";
import { RootState } from "@/store";
import { login as loginAction } from "@/store/slices/authSlice";
import { closeLoginModal } from "@/store/slices/uiSlice";

import styles from "./LoginModal.module.scss";

export default function LoginModal() {
    const dispatch = useDispatch();
    const open = useSelector((state: RootState) => state.ui.loginModalOpen);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);

        try {
            const user = await loginService(email, password);

            if (user) {
                dispatch(loginAction(user));
                dispatch(closeLoginModal());

                setAlertSeverity("success");
                setAlertMessage("Sesión iniciada");
                setAlertOpen(true);
            }
            else {
                setAlertSeverity('warning');
                setAlertMessage("Credenciales incorrectas");
                setAlertOpen(true);
            }
        }
        catch {
            setAlertSeverity('error');
            setAlertMessage("Error al iniciar sesión");
            setAlertOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => dispatch(closeLoginModal())}
            slotProps={{ paper: { className: styles.modal } }}>
            <Box className={styles.content}>
                <Box className={styles.topImage}>
                    <Image
                        src="/assets/login-modal.png"
                        alt="Evento"
                        fill
                        className={styles.image}
                    />
                </Box>

                <Box className={styles.bottomImage}>
                    <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        fill
                        className={styles.logo}
                    />
                </Box>

                <Typography variant="h4" mt={2} className="textPrimary textBold">
                    Inicia sesión
                </Typography>

                <Box className={styles.inputContainer}>
                    <Typography variant="subtitle1" mb={1} sx={{ color: 'var(--color-text-tertiary)' }}>
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
                            placeholder="alanaschr@gmail.com"
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                </Box>

                <Box mt={1} className={styles.inputContainer}>
                    <Typography variant="subtitle1" mb={1} sx={{ color: 'var(--color-text-tertiary)' }}>
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

                <Button
                    variant="text"
                    className={styles.actionLink}
                >
                    ¿Olvidaste tu contraseña?
                </Button>
                <Box className={styles.actionContainer}>
                    <Button
                        className={`btn btnPrimary ${styles.action}`}
                        onClick={handleLogin}
                    >
                        Iniciar sesión
                    </Button>
                    <Button
                        className={`btn btnPrimaryDark ${styles.action}`}
                    >
                        Crea una cuenta
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
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Dialog>
    );
}