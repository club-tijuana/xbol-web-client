"use client";

import { FormControl, Grid, Input, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { ClientInfoRequest } from "@/models/requests/client-info-request.dto";
import { useAppDispatch } from "@/store/hooks";
import { setBookClientContact } from "@/store/slices/bookingSlice";

export default function ClientInfo() {
    const dispatch = useAppDispatch();
    const [client, setClient] = useState<ClientInfoRequest>({
        firstName: "",
        lastName: "",
        email: "",
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
                    <Typography variant="caption" mb={1} color="muted" mt={2}>
                        Teléfono
                    </Typography>
                    <FormControl fullWidth variant="filled">
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            required
                            type={'phone'}
                            inputProps={{ style: { fontSize: 16 } }}
                            sx={{
                                backgroundColor: 'white',
                                '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                            }}
                            value={client.phoneNumber ?? ""}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
    );
}