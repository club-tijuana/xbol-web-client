"use client";

import { Alert, AlertColor, AlertTitle, Box, Button, FormControl, Grid, Input, Paper, Snackbar, Typography } from "@mui/material";
import { useState } from "react";

import Loader from "@/components/Loader/Loader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendForgotPasswordEmail } from "@/store/slices/authSlice";
import { colors } from "@/theme/colors";

export default function ResetPasswordForm() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(state => state.auth.forgotPasswordStatus);

    const [username, setUsername] = useState("");
    const [alertMessage, setAlertMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success')

    const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        if (status === "loading") {
            return;
        }
        const result = await dispatch(sendForgotPasswordEmail(username));

        if (sendForgotPasswordEmail.rejected.match(result)) {
            const message =
                result.payload || result.error.message || "Error al enviar el correo de recuperación de contraseña.";

            setAlertSeverity("error");
            setAlertMessage(message);
            setAlertOpen(true);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit}
            display={"flex"} flexDirection={"column"}
            sx={{
                minHeight: "100vh",
                justifyContent: "center"
            }}>
            <Grid container columns={3}>
                {status === "success" &&
                    <Grid size={1} offset={1} mb={3}>
                        <Alert severity="success">
                            <AlertTitle>Correo enviado</AlertTitle>
                            Hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico. Revisa tu bandeja de entrada.
                        </Alert>
                    </Grid>
                }
                <Grid size={1} offset={1}>
                    <Paper elevation={3} className="paperCard" sx={{ backgroundColor: "white" }}>
                        <Box>
                            <Box>
                                <Typography variant="caption" mb={1} color={'text'} mt={2}>
                                    Correo
                                </Typography>
                                <FormControl fullWidth variant="filled">
                                    <Input
                                        id="email"
                                        type={'email'}
                                        inputProps={{
                                            "aria-label": "Correo electrónico",
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
                            <Box mt={5} display={"flex"} sx={{ justifyContent: "end" }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={status === "loading"}
                                    sx={{ paddingTop: 1.2, paddingBottom: 1.2 }}
                                >
                                    <Typography variant="body1" color={colors.text.neutral}>
                                        Enviar
                                    </Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

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
            <Loader isLoading={status === "loading"} />
        </Box>
    );
}