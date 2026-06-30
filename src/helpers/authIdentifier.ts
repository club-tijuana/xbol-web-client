import {
    formatPhoneNumber,
    parsePhoneNumber,
} from "react-phone-number-input";

export const authPhoneCountries = [
    { code: "US", label: "Estados Unidos" },
    { code: "MX", label: "México" },
    { code: "CA", label: "Canadá" },
] as const;

export type AuthPhoneCountryCode = typeof authPhoneCountries[number]["code"];
export const defaultAuthPhoneCountryCode: AuthPhoneCountryCode = "MX";

const supportedPhoneCountryCodes = new Set<string>(
    authPhoneCountries.map(country => country.code),
);

export function isAuthPhoneCountryCode(value: string): value is AuthPhoneCountryCode {
    return supportedPhoneCountryCodes.has(value);
}

export function getPhoneAuthIdentifier(
    value: string,
    countryCode?: string,
): string | null {
    const trimmed = value.trim();
    if (!trimmed || trimmed.includes("@")) {
        return null;
    }

    let parseCountry: AuthPhoneCountryCode | undefined;
    if (!trimmed.startsWith("+")) {
        if (!countryCode || !isAuthPhoneCountryCode(countryCode)) {
            return null;
        }

        parseCountry = countryCode;
    }

    const phoneNumber = parsePhoneNumber(trimmed, parseCountry);
    if (!phoneNumber?.isValid() || !phoneNumber.country || !supportedPhoneCountryCodes.has(phoneNumber.country)) {
        return null;
    }

    return phoneNumber.number;
}

export function getPhoneAuthCountry(value: string): AuthPhoneCountryCode | null {
    const phoneNumber = parsePhoneNumber(value.trim());
    if (!phoneNumber?.country || !supportedPhoneCountryCodes.has(phoneNumber.country)) {
        return null;
    }

    return phoneNumber.country as AuthPhoneCountryCode;
}

export function resolvePhoneAuthCountryCode(
    value: string,
    currentCountryCode: string,
): AuthPhoneCountryCode {
    return getPhoneAuthCountry(value) ?? (
        isAuthPhoneCountryCode(currentCountryCode)
            ? currentCountryCode
            : defaultAuthPhoneCountryCode
    );
}

export function isPhoneAuthIdentifier(
    value: string,
    countryCode?: string,
): boolean {
    return getPhoneAuthIdentifier(value, countryCode) !== null;
}

export function isPhoneLikeAuthIdentifier(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed || trimmed.includes("@")) {
        return false;
    }

    const digitCount = (trimmed.match(/\d/g) ?? []).length;
    return digitCount >= 3 && /^[+\d().\-\s]+$/.test(trimmed);
}

export function shouldShowPhoneCountrySelector(
    value: string,
    forceVisible = false,
): boolean {
    if (forceVisible) {
        return true;
    }

    const trimmed = value.trim();
    return isPhoneLikeAuthIdentifier(trimmed) && !trimmed.startsWith("+");
}

export function formatPhoneAuthIdentifier(
    value: string,
    countryCode?: string,
): string {
    const normalizedPhone = getPhoneAuthIdentifier(value, countryCode);
    if (!normalizedPhone) {
        return value;
    }

    return formatPhoneNumber(normalizedPhone) || value;
}

export function normalizePhoneAuthInputValue(
    value: string,
    currentCountryCode: string,
): { countryCode: AuthPhoneCountryCode; value: string } {
    const countryCode = resolvePhoneAuthCountryCode(value, currentCountryCode);
    const normalizedPhone = getPhoneAuthIdentifier(value, countryCode);
    if (!value.trim().startsWith("+") || !normalizedPhone) {
        return { countryCode, value };
    }

    return {
        countryCode,
        value: formatPhoneNumber(normalizedPhone) || value,
    };
}

export function normalizeAuthIdentifier(value: string): string {
    return value.trim();
}
