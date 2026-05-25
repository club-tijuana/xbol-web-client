"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, CircularProgress, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register } from "@/store/slices/authSlice";
import { colors } from "@/theme/colors";

interface RegisterFormProps {
    title?: string;
}

export default function RegisterForm({
    title = "Crear cuenta",
}: RegisterFormProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const status = useAppSelector(state => state.auth.status);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

        const result = await dispatch(register({
            email,
            password,
            fullName,
            phoneNumber,
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

    const isLoading = status === "loading";

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

                <TextField
                    label="Correo electrónico"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    fullWidth
                    type="email"
                    variant="filled"
                />

                <TextField
                    label="Teléfono"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    fullWidth
                    type="tel"
                    variant="filled"
                />

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

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
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
