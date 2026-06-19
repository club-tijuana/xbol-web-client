export interface ClientProfileDto {
    id: number;
    userId: string;
    fullName: string;
    businessName?: string | null;
    email: string;
    phoneNumber?: string | null;
    phoneRegionCodeId?: number | null;
    phoneCode?: string | null;
}

export interface AuthMeResponse {
    firebaseUid: string;
    email?: string | null;
    emailVerified: boolean;
    phoneNumber?: string | null;
    signInProvider?: string | null;
    client?: ClientProfileDto | null;
    onboardingStatus: string;
    verificationStatus?: string;
}

export interface RegisterRequest {
    identifier: string;
    identifierCountryCode?: string;
    password?: string;
    fullName: string;
}

export interface RegisterResponse {
    firebaseUid: string;
    customToken?: string | null;
    client: ClientProfileDto;
    onboardingStatus: string;
    verificationStatus?: string;
}
