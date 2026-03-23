"use client";

import { FormControl, Grid, Input, Paper, TextField, Typography } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import PhoneInput, { DefaultInputComponentProps, parsePhoneNumber } from "react-phone-number-input";
import es from 'react-phone-number-input/locale/es'

import 'react-phone-number-input/style.css'
import { useDebounce } from "@/hooks/useDebounce";
import { ClientInfoRequest } from "@/models/requests/client-info-request.dto";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookClientContact } from "@/store/slices/bookingSlice";

/* -------------------- CONSTANTS -------------------- */
const DEFAULT_PHONE_COUNTRY = "MX";

// TODO: This component its also used in ShareTicketDialog. Make it a independant component.
const PhoneTextField = forwardRef<HTMLInputElement, DefaultInputComponentProps>((props, ref) => {
    return (
        <TextField
            {...props}
            inputRef={ref}
            fullWidth
            variant="filled"
            slotProps={{
                htmlInput: {
                    style: { fontSize: 16, paddingTop: 5, paddingBottom: 4 }
                }
            }}
            sx={{
                backgroundColor: "white",
                "& .MuiFilledInput-root:after": {
                    borderBottom: "2px solid var(--color-text-primary)"
                }
            }}
        />
    );
});

PhoneTextField.displayName = "PhoneTextField";

export default function ClientInfo() {
    const [phoneValue, setPhoneValue] = useState<string | undefined>();
    const dispatch = useAppDispatch();
    const accountInfo = useAppSelector(store => store.auth.user);
    const [client, setClient] = useState<ClientInfoRequest>({
        firstName: accountInfo?.firstName ?? "",
        lastName: accountInfo?.lastName ?? "",
        email: accountInfo?.username ?? "",
        phoneNumber: ""
    });

    const debounceClient = useDebounce(client, 600);

    useEffect(() => {
        dispatch(setBookClientContact({
            ...debounceClient,
            fullName: `${debounceClient.firstName ?? ""} ${debounceClient.lastName ?? ""}`.trim()
        }));
    }, [debounceClient, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setClient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Paper elevation={3} className="paperCard" sx={{ backgroundColor: "white" }}>
            <Typography variant="h3" color="primary">
                Datos del cliente
            </Typography>
            <Grid container columns={2} spacing={2}>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Nombre
                    </Typography>
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="firstName"
                            name="firstName"
                            type={'text'}
                            inputProps={{ style: { fontSize: 16 } }}
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            value={client.firstName ?? ""}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Apellido
                    </Typography>
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="lastName"
                            name="lastName"
                            required
                            type={'text'}
                            inputProps={{ style: { fontSize: 16 } }}
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            value={client.lastName ?? ""}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Correo
                    </Typography>
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="email"
                            name="email"
                            required
                            type={'email'}
                            inputProps={{ style: { fontSize: 16 } }}
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            value={client.email ?? ""}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 2, md: 1, lg: 1, xl: 1 }}>
                    <Typography variant="body1" mb={1} color="muted">
                        Teléfono
                    </Typography>
                    <PhoneInput
                        defaultCountry={DEFAULT_PHONE_COUNTRY}
                        value={phoneValue}
                        onChange={(value) => {
                            setPhoneValue(value);

                            if (!value) {
                                setClient(prev => ({
                                    ...prev,
                                    phoneNumber: "",
                                    phoneIsoCode: "",
                                    phoneCode: "",
                                    fullPhone: ""
                                }));
                                return;
                            }

                            const phoneNumber = parsePhoneNumber(value);

                            setClient(prev => ({
                                ...prev,
                                phoneNumber: phoneNumber?.nationalNumber ?? "",
                                phoneIsoCode: phoneNumber ? `+${phoneNumber.countryCallingCode}` : "",
                                phoneCode: phoneNumber ? `+${phoneNumber.countryCallingCode}` : "",
                                fullPhone: value
                            }));
                        }}
                        labels={es}
                        inputComponent={PhoneTextField}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}