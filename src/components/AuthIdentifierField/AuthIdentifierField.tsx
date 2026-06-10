"use client";

import {
    FormControl,
    Input,
    InputAdornment,
    InputProps,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    TextFieldProps,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { getCountryCallingCode } from "react-phone-number-input";

import {
    authPhoneCountries,
    defaultAuthPhoneCountryCode,
    formatPhoneAuthIdentifier,
    isAuthPhoneCountryCode,
    shouldShowPhoneCountrySelector,
} from "@/helpers/authIdentifier";

type AuthIdentifierControlProps = {
    countryCode: string;
    onCountryCodeChange: (value: string) => void;
    onValueChange: (value: string) => void;
    value: string;
};

type AuthIdentifierFieldProps = Omit<TextFieldProps, "onChange" | "value"> & AuthIdentifierControlProps;

type AuthIdentifierInputProps = Omit<InputProps, "onBlur" | "onChange" | "value"> & AuthIdentifierControlProps & {
    fullWidth?: boolean;
    onBlur?: InputProps["onBlur"];
};

const countrySelectorLabel = "País para teléfono";

const countryAdornmentSx: SxProps<Theme> = {
    alignItems: "center",
    alignSelf: "stretch",
    height: "auto",
    maxHeight: "none",
    mr: 0.75,
};

const countryFormControlSx: SxProps<Theme> = {
    alignSelf: "center",
    height: 32,
    justifyContent: "center",
};

const countrySelectSx: SxProps<Theme> = {
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    height: 32,
    lineHeight: 1,
    minWidth: 92,
    "& .MuiSelect-icon": {
        right: 2,
    },
    "& .MuiSelect-select": {
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        height: 32,
        justifyContent: "center",
        lineHeight: 1,
        minHeight: "unset",
        pb: 0,
        pl: 1,
        pr: "24px !important",
        pt: 0,
    },
};

function AuthIdentifierCountryAdornment({
    countryCode,
    onCountryCodeChange,
}: {
    countryCode: string;
    onCountryCodeChange: (event: SelectChangeEvent<string>) => void;
}) {
    const selectedCountryCode = isAuthPhoneCountryCode(countryCode) ? countryCode : defaultAuthPhoneCountryCode;

    return (
        <InputAdornment position="start" sx={countryAdornmentSx}>
            <FormControl variant="standard" size="small" sx={countryFormControlSx}>
                <Select
                    aria-label={countrySelectorLabel}
                    disableUnderline
                    displayEmpty
                    inputProps={{ "aria-label": countrySelectorLabel }}
                    value={selectedCountryCode}
                    onChange={onCountryCodeChange}
                    renderValue={(selected) => {
                        const country = isAuthPhoneCountryCode(selected)
                            ? selected
                            : defaultAuthPhoneCountryCode;

                        return `${country} +${getCountryCallingCode(country)}`;
                    }}
                    sx={countrySelectSx}
                >
                    {authPhoneCountries.map(country => (
                        <MenuItem key={country.code} value={country.code}>
                            {country.label} (+{getCountryCallingCode(country.code)})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </InputAdornment>
    );
}

export default function AuthIdentifierField({
    countryCode,
    onBlur,
    onCountryCodeChange,
    onValueChange,
    slotProps,
    value,
    ...textFieldProps
}: AuthIdentifierFieldProps) {
    const showCountrySelector = shouldShowPhoneCountrySelector(value);

    const handleCountryChange = (event: SelectChangeEvent<string>) => {
        const nextCountryCode = event.target.value;
        onCountryCodeChange(nextCountryCode);

        const formatted = formatPhoneAuthIdentifier(value, nextCountryCode);
        if (formatted !== value) {
            onValueChange(formatted);
        }
    };

    const handleBlur: TextFieldProps["onBlur"] = (event) => {
        const formatted = formatPhoneAuthIdentifier(value, countryCode);
        if (formatted !== value) {
            onValueChange(formatted);
        }

        onBlur?.(event);
    };

    return (
        <TextField
            {...textFieldProps}
            value={value}
            onBlur={handleBlur}
            onChange={(event) => onValueChange(event.target.value)}
            type="text"
            slotProps={{
                ...slotProps,
                htmlInput: {
                    ...slotProps?.htmlInput,
                    inputMode: showCountrySelector ? "tel" : "text",
                },
                input: {
                    ...slotProps?.input,
                    startAdornment: showCountrySelector ? (
                        <AuthIdentifierCountryAdornment
                            countryCode={countryCode}
                            onCountryCodeChange={handleCountryChange}
                        />
                    ) : undefined,
                },
            }}
        />
    );
}

export function AuthIdentifierInput({
    countryCode,
    fullWidth,
    inputProps,
    onBlur,
    onCountryCodeChange,
    onValueChange,
    value,
    ...inputRootProps
}: AuthIdentifierInputProps) {
    const showCountrySelector = shouldShowPhoneCountrySelector(value);

    const handleCountryChange = (event: SelectChangeEvent<string>) => {
        const nextCountryCode = event.target.value;
        onCountryCodeChange(nextCountryCode);

        const formatted = formatPhoneAuthIdentifier(value, nextCountryCode);
        if (formatted !== value) {
            onValueChange(formatted);
        }
    };

    const handleBlur: InputProps["onBlur"] = (event) => {
        const formatted = formatPhoneAuthIdentifier(value, countryCode);
        if (formatted !== value) {
            onValueChange(formatted);
        }

        onBlur?.(event);
    };

    return (
        <FormControl fullWidth={fullWidth} variant="filled">
            <Input
                {...inputRootProps}
                value={value}
                onBlur={handleBlur}
                onChange={(event) => onValueChange(event.target.value)}
                type="text"
                inputProps={{
                    ...inputProps,
                    inputMode: showCountrySelector ? "tel" : "text",
                }}
                startAdornment={showCountrySelector ? (
                    <AuthIdentifierCountryAdornment
                        countryCode={countryCode}
                        onCountryCodeChange={handleCountryChange}
                    />
                ) : undefined}
            />
        </FormControl>
    );
}
