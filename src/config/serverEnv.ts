import "server-only";

import { z } from "zod";

export const DEFAULT_SESSION_COOKIE_NAME = "xbol_client_session";

const serviceAccountJsonError =
  "FIREBASE_SERVICE_ACCOUNT_JSON is required for Firebase Admin SDK session cookies.";

const serviceAccountJsonSchema = z
  .string({
    message: serviceAccountJsonError,
  })
  .trim()
  .min(1, serviceAccountJsonError)
  .refine((value) => {
    try {
      const parsed: unknown = JSON.parse(value);

      return typeof parsed === "object" && parsed !== null;
    } catch {
      return false;
    }
  }, "FIREBASE_SERVICE_ACCOUNT_JSON must be a valid single-line JSON object.");

const firebaseAdminEnvSchema = z.object({
  FIREBASE_SERVICE_ACCOUNT_JSON: serviceAccountJsonSchema,
});

const sessionCookieEnvSchema = z.object({
  FIREBASE_SESSION_COOKIE_NAME: z
    .string()
    .trim()
    .min(1, "FIREBASE_SESSION_COOKIE_NAME cannot be empty.")
    .optional()
    .default(DEFAULT_SESSION_COOKIE_NAME),
  FIREBASE_SESSION_COOKIE_SECURE: z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim() === "") {
        return undefined;
      }

      return value;
    },
    z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  ),
});

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
