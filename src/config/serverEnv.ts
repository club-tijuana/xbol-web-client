import "server-only";

import type { z } from "zod";

import {
  serverEnvSchema,
} from "./envContracts";

export {
  DEFAULT_SESSION_COOKIE_NAME,
  serverEnvMetadata,
  serverEnvSchema,
} from "./envContracts";

const firebaseAdminEnvSchema = serverEnvSchema.pick({
  FIREBASE_SERVICE_ACCOUNT_JSON: true,
});
const sessionCookieEnvSchema = serverEnvSchema.pick({
  FIREBASE_SESSION_COOKIE_NAME: true,
  FIREBASE_SESSION_COOKIE_SECURE: true,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type FirebaseAdminEnv = z.infer<typeof firebaseAdminEnvSchema>;
export type SessionCookieEnv = z.infer<typeof sessionCookieEnvSchema>;

export function validateFirebaseAdminEnv(env: {
  FIREBASE_SERVICE_ACCOUNT_JSON?: string;
}): FirebaseAdminEnv {
  return firebaseAdminEnvSchema.parse(env);
}

export function validateSessionCookieEnv(env: {
  FIREBASE_SESSION_COOKIE_NAME?: string;
  FIREBASE_SESSION_COOKIE_SECURE?: string;
}): SessionCookieEnv {
  return sessionCookieEnvSchema.parse(env);
}

export function getFirebaseAdminEnv(): FirebaseAdminEnv {
  return validateFirebaseAdminEnv({
    FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
  });
}

export function getSessionCookieEnv(): SessionCookieEnv {
  return validateSessionCookieEnv({
    FIREBASE_SESSION_COOKIE_NAME: process.env.FIREBASE_SESSION_COOKIE_NAME,
    FIREBASE_SESSION_COOKIE_SECURE: process.env.FIREBASE_SESSION_COOKIE_SECURE,
  });
}
