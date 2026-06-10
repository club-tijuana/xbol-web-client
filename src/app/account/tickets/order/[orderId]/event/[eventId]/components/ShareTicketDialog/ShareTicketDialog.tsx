"use client";

import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, Input, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { forwardRef, useEffect, useState } from "react";
import PhoneInput, { Country, DefaultInputComponentProps, parsePhoneNumber } from "react-phone-number-input";
import es from 'react-phone-number-input/locale/es'

import 'react-phone-number-input/style.css'
import { OrderType } from "@/models/enums/order-type.enum";
import { PhoneRegionCodeResponse } from "@/models/phone-region-code-response.dto";
import { ShareTicket } from "@/models/requests/share-ticket.dto";
import { UnshareTicket } from "@/models/requests/unshare-ticket.dto";
import { getPhoneRegionCodes } from "@/services/phoneNumbersService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetStatus, share, unshare } from "@/store/slices/shareTicketSlice";

import { ShareTicketDialogProps } from "./ShareTicketDialog.type";

/* -------------------- CONSTANTS -------------------- */
const DEFAULT_PHONE_COUNTRY = "MX";

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

export default function ShareTicketDialog({ ticketId, open, variant, orderType, onClose }: ShareTicketDialogProps) {
    const dispatch = useAppDispatch();
    const shareTicketState = useAppSelector(state => state.shareTicket);

    const [client, setClient] = useState<ShareTicket>({
        ticketId: ticketId,
        email: "",
        fullPhone: "",
        phone: "",
        phoneRegionCodeId: undefined,
        applyToEntireSeason: false
    });
    const [unshareReq, setUnshareReq] = useState<UnshareTicket>({
        ticketId: ticketId,
        applyToEntireSeason: true
    });
    const [toggleValue, setToggleValue] = useState<boolean>(false);
    const [phoneValue, setPhoneValue] = useState<string | undefined>();
    const [phoneRegionCodes, setPhoneRegionCodes] = useState<PhoneRegionCodeResponse[]>();
    const [allowedRegionCodes, setAllowedRegionCodes] = useState<Country[]>();

    useEffect(() => {
        const loadRegionCodes = async () => {
            const response = await getPhoneRegionCodes();
            setPhoneRegionCodes(response);

            const allowed = response?.map(rc =>
                rc.regionCode.toUpperCase()
            ) as Country[];
            setAllowedRegionCodes(allowed);
        };

        loadRegionCodes();
    }, []);

    useEffect(() => {
        if (shareTicketState.status === "success") {
            if (variant === "share") {
                onClose(`Ticket compartido con el Cliente con correo ${client.email} y teléfono ${client.fullPhone}`, "success");
            }
            else if (variant === "unshare") {
                onClose(`El ticket se ha dejado de compartir`, "success");
            }
        }
        else if (shareTicketState.status === "error") {
            onClose();
        }
    }, [shareTicketState.status, client, onClose, variant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setClient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleShareTicket = async () => {
        const result = await dispatch(share(client));

        if (share.fulfilled.match(result)) {
            setClient({
                ticketId: 0,
                email: "",
                phone: "",
                fullPhone: "",
                phoneRegionCodeId: undefined,
                applyToEntireSeason: false
            });

            dispatch(resetStatus());
            onClose(undefined);
        }
        else if (share.rejected.match(result)) {
            dispatch(resetStatus());
            onClose(result.payload, "error");
        }
    };

    const handleUnshareTicket = async () => {
        await dispatch(unshare(unshareReq));

        setUnshareReq({
            ticketId: 0,
            applyToEntireSeason: false
        });
    };

    const handleToggleChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: boolean
    ) => {
        switch (variant) {
            case "share":
                setClient(prev => ({
                    ...prev,
                    applyToEntireSeason: newValue
                }));
                break;
            case "unshare":
                setUnshareReq(prev => ({
                    ...prev,
                    applyToEntireSeason: newValue
                }));
                break;
        };

        setToggleValue(newValue);
    };

    const handlePhoneChange = (value?: string) => {
        if (!value) {
            setClient(prev => ({
                ...prev,
                phone: "",
                fullPhone: "",
                phoneRegionCodeId: undefined
            }));

            return;
        }

        const parsed = parsePhoneNumber(value);

        const matchedRegion = phoneRegionCodes?.find(
            x => x.regionCode === parsed?.country
        );

        setClient(prev => ({
            ...prev,
            phoneRegionCodeId: matchedRegion?.id,
            phone: parsed?.nationalNumber ?? "",
            fullPhone: value
        }));
    };

    return (
        <Dialog open={open}>
            <DialogTitle>
                {variant === "share" ? "Compartir ticket" : "Dejar de compartir ticket"}
            </DialogTitle>
            <DialogContent>
                <Box>
                    {variant === "share" ?
                        <Box>
                            <Typography variant="body1" color="muted" fontWeight={600}>
                                Estás a punto de compartir este ticket.
                            </Typography>
                            <Typography mt={1} color="muted">
                                Le darás acceso a este ticket a la persona que estás ingresando.
                            </Typography >
                            <Typography mt={1} color="muted">
                                Esa persona debe tener una cuenta registrada para poder verlo y utilizarlo.
                            </Typography >
                            <Typography mt={1} color="muted">
                                Ten en cuenta que, mientras esté compartido, podrá acceder a la información del ticket como si fuera suyo.
                            </Typography>
                            <Typography mt={1} color="muted">
                                Puedes dejar de compartirlo en cualquier momento desde tu cuenta.
                            </Typography>
                        </Box>
                        :
                        <Box>
                            <Typography variant="body1" color="text" fontWeight={600}>
                                Estás a punto de dejar de compartir este ticket.
                            </Typography>
                            <Typography mt={1}>
                                Al continuar, la persona con la que lo compartiste perderá el acceso de inmediato y ya no podrá ver ni utilizar este ticket.
                            </Typography>
                            <Typography mt={1}>
                                Esta acción no se puede deshacer automáticamente; si deseas volver a compartirlo, tendrás que hacerlo nuevamente.
                            </Typography>
                        </Box>
                    }
                </Box>
                {variant === "share" &&
                    <Grid container columns={2} spacing={2} mt={3}>
                        <Grid size={1}>
                            <Typography variant="body1" mb={1} color="muted">
                                Correo
                            </Typography>
                            <FormControl fullWidth variant="filled">
                                <Input
                                    id="email"
                                    name="email"
                                    required
                                    type={'email'}
                                    inputProps={{ style: { fontSize: 16, paddingLeft: 10, paddingRight: 10 } }}
                                    sx={{
                                        backgroundColor: 'white',
                                        '&:after': { borderBottom: '2px solid var(--color-text-primary)' },
                                    }}
                                    value={client.email ?? ""}
                                    onChange={handleChange}
                                />
                            </FormControl>

                        </Grid>
                        {(phoneRegionCodes && allowedRegionCodes) &&
                            <Grid size={1}>
                                <Typography variant="body1" mb={1} color="muted">
                                    Teléfono
                                </Typography>
                                <PhoneInput
                                    defaultCountry={DEFAULT_PHONE_COUNTRY}
                                    countries={allowedRegionCodes}
                                    value={phoneValue}
                                    onChange={handlePhoneChange}
                                    labels={es}
                                    inputComponent={PhoneTextField}
                                />
                                {/* <PhoneInput
                                defaultCountry={DEFAULT_PHONE_COUNTRY}
                                value={phoneValue}
                                onChange={(value) => {
                                    setPhoneValue(value);

                                    if (!value) {
                                        setClient(prev => ({
                                            ...prev,
                                            phone: "",
                                            phoneIsoCode: "",
                                            phoneCode: "",
                                            fullPhone: ""
                                        }));
                                        return;
                                    }

                                    const phoneNumber = parsePhoneNumber(value);

                                    setClient(prev => ({
                                        ...prev,
                                        phone: phoneNumber?.nationalNumber ?? "",
                                        phoneIsoCode: phoneNumber?.country ?? "",
                                        phoneCode: phoneNumber ? `+${phoneNumber.countryCallingCode}` : "",
                                        fullPhone: value
                                    }));
                                }}
                                labels={es}
                                inputComponent={PhoneTextField}
                            /> */}
                            </Grid>
                        }
                    </Grid>
                }
                {orderType === OrderType.SeasonPass &&
                    <Box mt={4} textAlign="center">
                        <ToggleButtonGroup
                            color="primary"
                            value={toggleValue}
                            exclusive
                            onChange={handleToggleChange}>
                            <ToggleButton value={false}>Aplicar solo el ticket</ToggleButton>
                            <ToggleButton value={true}>Aplicar a toda la temporada</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                }
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button variant="outlined" onClick={() => { onClose(undefined); }}>
                    Cancelar
                </Button>
                {variant === "share" &&
                    <Button variant="contained" onClick={handleShareTicket}>
                        Compartir
                    </Button>
                }
                {variant === "unshare" &&
                    <Button variant="contained" onClick={handleUnshareTicket}>
                        Dejar de compartir
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
}
