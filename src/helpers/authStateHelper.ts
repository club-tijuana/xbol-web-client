import { AuthDto } from "@/models/auth.dto";

export function isEmailVerified(user: AuthDto | null | undefined): boolean {
    return user?.emailVerified === true || user?.verificationStatus === "verified";
}

export function canUseVerifiedClientFeatures(
    user: AuthDto | null | undefined,
): user is AuthDto {
    return Boolean(user?.clientId && isEmailVerified(user));
}
