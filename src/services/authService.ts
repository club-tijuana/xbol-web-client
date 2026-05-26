import axios from "axios";

import { requestAxios } from "@/helpers/axiosHelper";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { splitName } from "@/helpers/splitNameHelper";
import { AuthMeResponse, ClientProfileDto, RegisterRequest, RegisterResponse } from "@/models/auth-profile.dto";
import { AuthDto, AuthenticatedAuthDto } from "@/models/auth.dto";
import { getFirebaseAuthErrorMessage, loginWithFirebase, loginWithFirebaseCustomToken, logoutFromFirebase, refreshCurrentFirebaseUser, sendCurrentFirebaseUserEmailVerification } from "@/services/firebaseClient";
import { getSessionApiPath } from "@/services/sessionApiPath";

const logoutErrorMessage = "Error al cerrar sesión";
const unlinkedClientProfileErrorMessage = "Perfil de cliente no vinculado";

class UnlinkedClientProfileError extends Error {
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

    return error.response?.status === 401 || error.response?.status === 403;
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
    const resolvedVerificationStatus = verificationStatus
        ?? (emailVerified === undefined
            ? undefined
            : emailVerified ? "verified" : "pending");

    return {
        userId: client.userId || firebaseUid,
        firebaseUid: client.userId || firebaseUid,
        clientId: client.id,
        username: client.email,
        email: client.email,
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

    return {
        ...mapClientProfileToAuthDto(
            profile.client,
            user.token ?? "",
            profile.firebaseUid,
            profile.verificationStatus,
            profile.emailVerified,
        ),
        username: profile.email ?? profile.client.email,
        email: profile.email ?? profile.client.email,
        emailVerified: profile.emailVerified,
        phoneNumber: profile.phoneNumber ?? profile.client.phoneNumber,
        token: user.token,
        onboardingStatus: profile.onboardingStatus,
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

        return mergeAuthProfile(user, profile);
    } catch (error) {
        if (isMissingClientProfileError(error)) {
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

export async function login(username: string, password: string): Promise<AuthDto> {
    let user: AuthenticatedAuthDto;

    try {
        user = await loginWithFirebase(username, password);
    } catch (error) {
        throw new Error(getFirebaseAuthErrorMessage(error));
    }

    try {
        await createSession(user.token);
        return await hydrateLinkedAuthProfile(user);
    } catch (error) {
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

export async function sendVerificationEmail(): Promise<void> {
    await sendCurrentFirebaseUserEmailVerification();
}

export async function refreshEmailVerificationStatus(user: AuthDto): Promise<AuthDto> {
    const refreshedFirebaseUser = await refreshCurrentFirebaseUser();

    return hydrateLinkedAuthProfile({
        ...user,
        ...refreshedFirebaseUser,
    });
}
