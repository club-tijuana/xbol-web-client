"use client";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, Input, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { forwardRef, useEffect, useState } from "react";
import PhoneInput, { DefaultInputComponentProps, parsePhoneNumber } from "react-phone-number-input";
import es from 'react-phone-number-input/locale/es'

import 'react-phone-number-input/style.css'
import { OrderType } from "@/models/enums/order-type.enum";
import { ShareTicket } from "@/models/requests/share-ticket.dto";
import { UnshareTicket } from "@/models/requests/unshare-ticket.dto";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { share, unshare } from "@/store/slices/shareTicketSlice";

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
        phone: "",
        phoneCode: "",
        phoneIsoCode: "",
        applyToEntireSeason: false
    });
    const [unshareReq, setUnshareReq] = useState<UnshareTicket>({
        ticketId: ticketId,
        applyToEntireSeason: true
    });
    const [toggleValue, setToggleValue] = useState<boolean>(false);
    const [phoneValue, setPhoneValue] = useState<string | undefined>();

    useEffect(() => {
        if (shareTicketState.status === "success") {
            if (variant === "share") {
                onClose(`Ticket compartido con el Cliente con correo ${client.email} y teléfono ${client.phoneCode}${client.phone}`);
            }
            else if (variant === "unshare") {
                onClose(`El ticket se ha dejado de compartir`);
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

        if (result) {
            setClient({
                ticketId: 0,
                email: "",
                phone: "",
                phoneCode: "",
                phoneIsoCode: "",
                applyToEntireSeason: false
            });
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

    return (
        <Dialog open={open}>
            <DialogTitle>Compartir ticket</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {variant === "share" ?
                        "Lorem ipsum dolor sit amet consectetur adipiscing elit, nulla iaculis pellentesque volutpat eget eleifend, nullam vitae fermentum laoreet risus scelerisque."
                        : "Lorem ipsum dolor sit amet consectetur adipiscing elit, nulla iaculis pellentesque volutpat eget eleifend, nullam vitae fermentum laoreet risus scelerisque. \n ¿Dejar de compartir?"}
                </DialogContentText>
                {variant === "share" &&
                    <Grid container columns={2} spacing={2}>
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
                        <Grid size={1}>
                            <Typography variant="body1" mb={1} color="muted">
                                Teléfono
                            </Typography>
                            <PhoneInput
                                defaultCountry={DEFAULT_PHONE_COUNTRY}
                                value={phoneValue}
                                onChange={(value) => {
                                    setPhoneValue(value);

                                    let phone = "";
                                    let callingCode = "";

                                    if (value) {
                                        const phoneNumber = parsePhoneNumber(value);

                                        phone = phoneNumber?.nationalNumber ?? "";
                                        callingCode = phoneNumber?.countryCallingCode ?? "";
                                    }

                                    console.log("CALLINGCODE: " + callingCode);
                                    setClient(prev => ({
                                        ...prev,
                                        phone: phone,
                                        phoneIsoCode: "+" + callingCode,
                                        phoneCode: "+" + callingCode
                                    }));
                                }}
                                labels={es}
                                inputComponent={PhoneTextField}
                            />
                        </Grid>
                    </Grid>
                }
                {orderType === OrderType.SeasonPass &&
                    <ToggleButtonGroup
                        color="primary"
                        value={toggleValue}
                        exclusive
                        onChange={handleToggleChange}>
                        <ToggleButton value={false}>Aplicar solo el ticket</ToggleButton>
                        <ToggleButton value={true}>Aplicar a toda la temporada</ToggleButton>
                    </ToggleButtonGroup>
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