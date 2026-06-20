export interface AuthDto {
    userId: string;
    username: string;
    token?: string;
    firstName: string;
    lastName: string;
    firebaseUid?: string;
    clientId?: number;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string | null;
    phoneRegionCodeId?: number | null;
    phoneCode?: string | null;
    onboardingStatus?: string;
    verificationStatus?: string;
}

export type AuthenticatedAuthDto = AuthDto & { token: string };
