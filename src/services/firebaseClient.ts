import { FirebaseError, initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, onIdTokenChanged, sendEmailVerification, signInWithCustomToken, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

import { publicEnv } from "@/config/env";
import { splitName } from "@/helpers/splitNameHelper";
import { AuthenticatedAuthDto } from "@/models/auth.dto";

const firebaseConfig = {
    apiKey: publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: publicEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: publicEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: publicEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    storageBucket: publicEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

function getFirebaseAuth() {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.tenantId = publicEnv.NEXT_PUBLIC_FIREBASE_TENANT_ID;

    return auth;
}

export async function mapFirebaseUser(user: User, forceRefresh = false): Promise<AuthenticatedAuthDto> {
    const token = await user.getIdToken(forceRefresh);
    const name = splitName(user.displayName);

    return {
        userId: user.uid,
        username: user.email ?? user.phoneNumber ?? user.uid,
        email: user.email ?? undefined,
        emailVerified: user.emailVerified,
        token,
        firstName: name.firstName,
        lastName: name.lastName,
    };
}

export async function loginWithFirebase(email: string, password: string): Promise<AuthenticatedAuthDto> {
    const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
    );

    return mapFirebaseUser(credential.user);
}

export async function loginWithFirebaseCustomToken(customToken: string): Promise<AuthenticatedAuthDto> {
    const credential = await signInWithCustomToken(getFirebaseAuth(), customToken);

    return mapFirebaseUser(credential.user);
}

export async function sendCurrentFirebaseUserEmailVerification(): Promise<void> {
    const auth = getFirebaseAuth();
    await auth.authStateReady();

    if (!auth.currentUser) {
        throw new Error("No hay una sesión de Firebase activa para verificar correo.");
    }

    if (auth.currentUser.emailVerified) {
        return;
    }

    await sendEmailVerification(auth.currentUser);
}

export async function refreshCurrentFirebaseUser(): Promise<AuthenticatedAuthDto> {
    const auth = getFirebaseAuth();
    await auth.authStateReady();

    if (!auth.currentUser) {
        throw new Error("No hay una sesión de Firebase activa.");
    }

    await auth.currentUser.reload();

    return mapFirebaseUser(auth.currentUser, true);
}

export async function logoutFromFirebase(): Promise<void> {
    await signOut(getFirebaseAuth());
}

export async function getFreshFirebaseToken(fallbackToken: string): Promise<string> {
    const auth = getFirebaseAuth();
    await auth.authStateReady();

    return auth.currentUser?.getIdToken() ?? fallbackToken;
}

export function onClientAuthTokenChanged(
    callback: (user: User | null) => void,
): () => void {
    return onIdTokenChanged(getFirebaseAuth(), callback);
}

export function getFirebaseAuthErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
        if (
            error.code === "auth/invalid-credential"
            || error.code === "auth/user-not-found"
            || error.code === "auth/wrong-password"
            || error.code === "auth/invalid-email"
        ) {
            return "Correo o contraseña inválidos";
        }
    }

    return "Error al iniciar sesión";
}
