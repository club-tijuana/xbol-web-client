import { DecodedIdToken } from "firebase-admin/auth";

import { splitName } from "@/helpers/splitNameHelper";
import { AuthDto } from "@/models/auth.dto";
import { getTenantAuth } from "@/services/firebaseAdmin";

type SessionCookieUser = Omit<AuthDto, "token">;

export const SESSION_COOKIE_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000;

const MAX_RECENT_SIGN_IN_AGE_SECONDS = 5 * 60;

export function mapDecodedTokenToSessionUser(
  decodedToken: DecodedIdToken,
): SessionCookieUser {
  const name = splitName(decodedToken.name);

  return {
    userId: decodedToken.uid,
    firebaseUid: decodedToken.uid,
    username: decodedToken.email ?? decodedToken.phone_number ?? decodedToken.uid,
    email: decodedToken.email,
    emailVerified: decodedToken.email_verified,
    firstName: name.firstName,
    lastName: name.lastName,
  };
}

export async function createSessionCookie(idToken: string): Promise<string> {
  const decodedToken = await getTenantAuth().verifyIdToken(idToken, true);
  const signInAgeSeconds = Date.now() / 1000 - decodedToken.auth_time;

  if (signInAgeSeconds > MAX_RECENT_SIGN_IN_AGE_SECONDS) {
    throw new Error("Recent sign-in is required to create a session cookie.");
  }

  return getTenantAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_COOKIE_EXPIRES_IN_MS,
  });
}

export async function verifySessionCookie(
  sessionCookie: string,
): Promise<SessionCookieUser> {
  const decodedToken = await getTenantAuth().verifySessionCookie(
    sessionCookie,
    true,
  );

  return mapDecodedTokenToSessionUser(decodedToken);
}
