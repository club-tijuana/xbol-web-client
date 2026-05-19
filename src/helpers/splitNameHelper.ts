export function splitName(fullName?: string | null) {
    const trimmedName = fullName?.trim();

    if (!trimmedName) {
        return {
            firstName: "",
            lastName: "",
        };
    }

    const [firstName, ...lastNameParts] = trimmedName.split(/\s+/);

    return {
        firstName,
        lastName: lastNameParts.join(" "),
    };
}
