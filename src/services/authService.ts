import axios from "axios";
import { ConfirmationResult } from "firebase/auth";

import { requestAxios } from "@/helpers/axiosHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { splitName } from "@/helpers/splitNameHelper";
import { AuthMeResponse, ClientProfileDto, RegisterRequest, RegisterResponse } from "@/models/auth-profile.dto";
import { AuthDto, AuthenticatedAuthDto } from "@/models/auth.dto";
import {
    getFirebaseAuthErrorMessage,
    loginWithFirebase,
    loginWithFirebaseCustomToken,
    loginWithFirebasePhoneCode,
    logoutFromFirebase,
    refreshCurrentFirebaseUser,
    sendCurrentFirebaseUserEmailVerification,
    sendFirebasePasswordResetEmail,
    sendPhoneSignInCode,
} from "@/services/firebaseClient";
import { getSessionApiPath } from "@/services/sessionApiPath";

const logoutErrorMessage = "Error al cerrar sesión";
const unlinkedClientProfileErrorMessage = "Perfil de cliente no vinculado";
const unlinkedClientProfileProblemCode = "unlinked_client_profile";

export class UnlinkedClientProfileError extends Error {
    constructor() {
        super(unlinkedClientProfileErrorMessage);
        this.name = "UnlinkedClientProfileError";
    }
}

function isMissingClientProfileError(error: unknown): boolean {
    if (error instanceof UnlinkedClientProfileError) {
        return true;
    }

    if (!axios.isAxiosError(error)) {
        return false;
    }

    const data = error.response?.data;
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if ("code" in data && data.code === unlinkedClientProfileProblemCode) {
        return true;
    }

    if ("extensions" in data && typeof data.extensions === "object" && data.extensions !== null) {
        return "code" in data.extensions
            && data.extensions.code === unlinkedClientProfileProblemCode;
    }

    return false;
}

export function isUnlinkedClientProfileError(error: unknown): error is UnlinkedClientProfileError {
    return isMissingClientProfileError(error);
}

async function createSession(idToken: string): Promise<void> {
    const response = await fetch(getSessionApiPath(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
        throw new Error("Error al iniciar sesión");
    }
}

async function clearSession(): Promise<void> {
    const response = await fetch(getSessionApiPath(), {
        method: "DELETE",
    }).catch(() => null);

    if (!response?.ok) {
        throw new Error(logoutErrorMessage);
    }
}

function mapClientProfileToAuthDto(
    client: ClientProfileDto,
    token: string,
    firebaseUid: string,
    verificationStatus?: string,
    emailVerified?: boolean,
): AuthDto {
    const name = splitName(client.fullName);
    const email = client.email?.trim() || undefined;
    const resolvedVerificationStatus = verificationStatus
        ?? (emailVerified === undefined
            ? undefined
            : emailVerified ? "verified" : "pending");

    return {
        userId: client.userId || firebaseUid,
        firebaseUid: client.userId || firebaseUid,
        clientId: client.id,
        username: email ?? client.phoneNumber ?? firebaseUid,
        email,
        emailVerified,
        token,
        firstName: name.firstName,
        lastName: name.lastName,
        phoneNumber: client.phoneNumber,
        phoneCode: client.phoneCode,
        onboardingStatus: "linked",
        verificationStatus: resolvedVerificationStatus,
    };
}

function mergeAuthProfile(user: AuthDto, profile: AuthMeResponse): AuthDto {
    if (!profile.client) {
        throw new UnlinkedClientProfileError();
    }

    const email = profile.email ?? (profile.client.email?.trim() || undefined);
    const phoneNumber = profile.phoneNumber ?? profile.client.phoneNumber;

    return {
        ...mapClientProfileToAuthDto(
            profile.client,
            user.token ?? "",
            profile.firebaseUid,
            profile.verificationStatus,
            profile.emailVerified,
        ),
        username: email ?? phoneNumber ?? profile.firebaseUid,
        email,
        emailVerified: profile.emailVerified,
        phoneNumber,
        token: user.token,
        onboardingStatus: profile.onboardingStatus,
    };
}

function mapUnlinkedPhoneProfile(user: AuthDto, profile: AuthMeResponse): AuthDto | null {
    const phoneNumber = profile.phoneNumber ?? user.phoneNumber;
    if (!phoneNumber) {
        return null;
    }

    return {
        ...user,
        userId: profile.firebaseUid,
        firebaseUid: profile.firebaseUid,
        username: phoneNumber,
        email: profile.email ?? user.email,
        emailVerified: profile.emailVerified,
        phoneNumber,
        onboardingStatus: "unlinked",
        verificationStatus: profile.verificationStatus ?? "verified",
    };
}

function mapAuthenticatedPhoneUserToUnlinkedProfile(user: AuthenticatedAuthDto): AuthDto | null {
    if (!user.phoneNumber) {
        return null;
    }

    return {
        ...user,
        username: user.phoneNumber,
        onboardingStatus: "unlinked",
        verificationStatus: "verified",
    };
}

export async function getCurrentAuthProfile(token: string): Promise<AuthMeResponse> {
    return requestAxios<undefined, AuthMeResponse>(
        "GET",
        "auth/me",
        undefined,
        token,
    );
}

export async function clearClientAuthentication(): Promise<void> {
    await clearSession().catch(() => undefined);
    await logoutFromFirebase().catch(() => undefined);
}

export async function hydrateAuthProfile(user: AuthDto): Promise<AuthDto | null> {
    if (!user.token) {
        return null;
    }

    try {
        const profile = await getCurrentAuthProfile(user.token);
        if (!profile.client) {
            return mapUnlinkedPhoneProfile(user, profile);
        }

        return mergeAuthProfile(user, profile);
    } catch (error) {
        if (isMissingClientProfileError(error)) {
            if (user.phoneNumber) {
                return {
                    ...user,
                    username: user.phoneNumber,
                    onboardingStatus: "unlinked",
                    verificationStatus: "verified",
                };
            }

            return null;
        }

        throw error;
    }
}

async function hydrateLinkedAuthProfile(user: AuthDto): Promise<AuthDto> {
    const hydratedUser = await hydrateAuthProfile(user);

    if (!hydratedUser) {
        throw new UnlinkedClientProfileError();
    }

    return hydratedUser;
}

async function completeLoginProfile(user: AuthenticatedAuthDto): Promise<AuthDto> {
    const profile = await requestAxios<undefined, AuthMeResponse>(
        "POST",
        "auth/complete-login",
        undefined,
        user.token,
    );

    return mergeAuthProfile(user, profile);
}

async function completePhoneLoginProfile(user: AuthenticatedAuthDto): Promise<AuthDto> {
    const profile = await requestAxios<undefined, AuthMeResponse>(
        "POST",
        "auth/complete-login",
        undefined,
        user.token,
    );

    if (!profile.client) {
        await clearSession().catch(() => undefined);
        const unlinkedUser = mapUnlinkedPhoneProfile(user, profile);
        if (!unlinkedUser) {
            throw new UnlinkedClientProfileError();
        }

        return unlinkedUser;
    }

    return mergeAuthProfile(user, profile);
}

export async function login(username: string, password: string): Promise<AuthDto> {
    let user: AuthenticatedAuthDto;

    try {
        user = await loginWithFirebase(username, password);
    } catch (error) {
        throw new Error(getFirebaseAuthErrorMessage(error));
    }

    try {
        await createSession(user.token);
        return await completeLoginProfile(user);
    } catch (error) {
        await clearClientAuthentication();
        throw error;
    }
}

export async function sendPhoneLoginCode(
    phoneNumber: string,
    recaptchaContainerId: string,
): Promise<ConfirmationResult> {
    try {
        return await sendPhoneSignInCode(phoneNumber, recaptchaContainerId);
    } catch (error) {
        throw new Error(getFirebaseAuthErrorMessage(error));
    }
}

export async function loginPhone(
    confirmation: ConfirmationResult,
    verificationCode: string,
): Promise<AuthDto> {
    let user: AuthenticatedAuthDto;

    try {
        user = await loginWithFirebasePhoneCode(confirmation, verificationCode);
    } catch (error) {
        throw new Error(getFirebaseAuthErrorMessage(error));
    }

    try {
        await createSession(user.token);
        return await completePhoneLoginProfile(user);
    } catch (error) {
        if (isMissingClientProfileError(error)) {
            await clearSession().catch(() => undefined);
            const unlinkedUser = mapAuthenticatedPhoneUserToUnlinkedProfile(user);
            if (unlinkedUser) {
                return unlinkedUser;
            }

            throw new UnlinkedClientProfileError();
        }

        await clearClientAuthentication();
        throw error;
    }
}

export async function register(request: RegisterRequest): Promise<AuthDto> {
    try {
        const registration = await requestAxios<RegisterRequest, RegisterResponse>(
            "POST",
            "auth/register",
            request,
        );

        if (!registration.customToken) {
            throw new Error("La API de registro no devolvió un token de Firebase válido.");
        }

        const user = await loginWithFirebaseCustomToken(registration.customToken);

        try {
            await createSession(user.token);

            const registeredUser = mapClientProfileToAuthDto(
                registration.client,
                user.token,
                registration.firebaseUid,
                registration.verificationStatus,
                user.emailVerified,
            );

            const hydratedUser = await hydrateLinkedAuthProfile({
                ...registeredUser,
                onboardingStatus: registration.onboardingStatus,
            });

            if (hydratedUser.emailVerified !== true) {
                await sendCurrentFirebaseUserEmailVerification().catch(() => undefined);
            }

            return hydratedUser;
        } catch (error) {
            await clearClientAuthentication();
            throw error;
        }
    } catch (error) {
        throw new Error(getErrorMessage(error, "Error al registrar cuenta"));
    }
}

export async function registerPhone(
    request: RegisterRequest,
    confirmation?: ConfirmationResult | null,
    verificationCode?: string,
    verifiedPhoneUser?: AuthDto | null,
): Promise<AuthDto> {
    let user: AuthenticatedAuthDto;

    try {
        if (confirmation) {
            user = await loginWithFirebasePhoneCode(confirmation, verificationCode ?? "");
        }
        else if (verifiedPhoneUser?.token && verifiedPhoneUser.phoneNumber) {
            user = { ...verifiedPhoneUser, token: verifiedPhoneUser.token };
        }
        else {
            user = await refreshCurrentFirebaseUser();
        }

        if (!user.phoneNumber) {
            throw new Error("Envía el código SMS antes de registrarte.");
        }
    } catch (error) {
        if (error instanceof Error && error.message.includes("No hay una sesión de Firebase activa")) {
            throw new Error("Envía el código SMS antes de registrarte.");
        }

        throw new Error(error instanceof Error ? error.message : getFirebaseAuthErrorMessage(error));
    }

    try {
        const registration = await requestAxios<RegisterRequest, RegisterResponse>(
            "POST",
            "auth/register",
            request,
            user.token,
        );

        await createSession(user.token);

        const registeredUser = mapClientProfileToAuthDto(
            registration.client,
            user.token,
            registration.firebaseUid,
            registration.verificationStatus,
            user.emailVerified,
        );

        return await hydrateLinkedAuthProfile({
            ...registeredUser,
            onboardingStatus: registration.onboardingStatus,
        });
    } catch (error) {
        await clearClientAuthentication();
        throw new Error(getErrorMessage(error, "Error al registrar teléfono"));
    }
}

export async function logout(): Promise<void> {
    let clearSessionError: unknown;

    try {
        await clearSession();
    } catch (error) {
        clearSessionError = error;
    }

    await logoutFromFirebase();

    if (clearSessionError) {
        throw clearSessionError;
    }
}

export async function sendPasswordReset(email: string): Promise<void> {
    try {
        await sendFirebasePasswordResetEmail(email);
    } catch (error) {
        throw new Error(getErrorMessage(error, "Error al enviar correo de recuperación"));
    }
}

export async function sendVerificationEmail(): Promise<void> {
    await sendCurrentFirebaseUserEmailVerification();
}

export async function refreshEmailVerificationStatus(user: AuthDto): Promise<AuthDto> {
    const refreshedFirebaseUser = await refreshCurrentFirebaseUser();

    return completeLoginProfile({
        ...user,
        ...refreshedFirebaseUser,
    });
}
