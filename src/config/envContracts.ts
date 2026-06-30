import { z } from "zod";

import { DEFAULT_EVENT_IMAGE } from "./defaults.ts";
import { defaultWhiteLabelId, whiteLabelIds } from "./whiteLabel/configs.ts";

const githubActionsEnvironments = ["GCP_DEV", "GCP_QA"] as const;

type EnvExposure = "public-build-time" | "server-runtime";
type GithubActionsStorage = "secret" | "variable";
type GithubActionsScope = "repository" | "environment";

export type EnvMetadata = {
  sensitive: boolean;
  exposure: EnvExposure;
  githubActions?: {
    storage: GithubActionsStorage;
    scope: GithubActionsScope;
    environments?: string[];
  };
};

function envMetadata(
  exposure: EnvExposure,
  storage: GithubActionsStorage,
  scope: GithubActionsScope,
): EnvMetadata {
  return {
    sensitive: storage === "secret",
    exposure,
    githubActions: {
      storage,
      scope,
      ...(scope === "environment"
        ? { environments: [...githubActionsEnvironments] }
        : {}),
    },
  };
}

export function publicBuildTimeEnv(
  storage: GithubActionsStorage,
  scope: GithubActionsScope,
): EnvMetadata {
  return envMetadata("public-build-time", storage, scope);
}

export function localPublicBuildTimeEnv(): EnvMetadata {
  return {
    sensitive: false,
    exposure: "public-build-time",
  };
}

export function serverRuntimeEnv(
  storage: GithubActionsStorage,
  scope: GithubActionsScope,
): EnvMetadata {
  return envMetadata("server-runtime", storage, scope);
}

export const DEFAULT_SESSION_COOKIE_NAME = "xbol_client_session";

const requiredString = (name: string) =>
  z.string().trim().min(1, `${name} is required.`);

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const booleanEnvFlag = () =>
  z.preprocess(
    emptyStringToUndefined,
    z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional()
      .default(false),
  );

const siteAccessMode = () =>
  z.preprocess(
    emptyStringToUndefined,
    z.enum(["open", "landing"]).optional().default("open"),
  );

const siteAccessAllowedCidrs = () =>
  z.preprocess(
    emptyStringToUndefined,
    z.string().optional(),
  );

const publicEnvShape = {
  NEXT_PUBLIC_API_BASE_URL: requiredString("NEXT_PUBLIC_API_BASE_URL").pipe(
    z.url({
      message: "NEXT_PUBLIC_API_BASE_URL must be a valid URL.",
    }),
  ).meta({ validation: "url" }),
  NEXT_PUBLIC_SEATS_WORKSPACE_KEY: requiredString(
    "NEXT_PUBLIC_SEATS_WORKSPACE_KEY",
  ).pipe(
    z.uuid({
      message: "NEXT_PUBLIC_SEATS_WORKSPACE_KEY must be a UUID",
    }),
  ).meta({ validation: "uuid" }),
  NEXT_PUBLIC_FIREBASE_API_KEY: requiredString(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
  ),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: requiredString(
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: requiredString(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  ),
  NEXT_PUBLIC_FIREBASE_APP_ID: requiredString("NEXT_PUBLIC_FIREBASE_APP_ID"),
  NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TESTING: booleanEnvFlag(),
  NEXT_PUBLIC_ENABLE_EMAIL_AUTH: booleanEnvFlag(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_BASE_PATH: z.string().optional(),
  NEXT_PUBLIC_ASSET_PREFIX: z.string().optional(),
  NEXT_PUBLIC_ADMIN_IMAGE_HOST: z.string().optional(),
  NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: z.preprocess(
    emptyStringToUndefined,
    z.string().optional().default(DEFAULT_EVENT_IMAGE),
  ),
  NEXT_PUBLIC_SECRET_BASE_32: z.string().optional(),
  NEXT_PUBLIC_WHITE_LABEL: z.preprocess(
    emptyStringToUndefined,
    z.enum(whiteLabelIds).optional().default(defaultWhiteLabelId),
  ),
};

export const publicEnvMetadata = {
  NEXT_PUBLIC_API_BASE_URL: publicBuildTimeEnv("secret", "environment"),
  NEXT_PUBLIC_SEATS_WORKSPACE_KEY: publicBuildTimeEnv(
    "variable",
    "environment",
  ),
  NEXT_PUBLIC_FIREBASE_API_KEY: publicBuildTimeEnv("variable", "environment"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: publicBuildTimeEnv(
    "variable",
    "environment",
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: publicBuildTimeEnv(
    "variable",
    "environment",
  ),
  NEXT_PUBLIC_FIREBASE_APP_ID: publicBuildTimeEnv("variable", "environment"),
  NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TESTING: localPublicBuildTimeEnv(),
  NEXT_PUBLIC_ENABLE_EMAIL_AUTH: localPublicBuildTimeEnv(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: publicBuildTimeEnv(
    "variable",
    "environment",
  ),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: publicBuildTimeEnv(
    "variable",
    "environment",
  ),
  NEXT_PUBLIC_BASE_PATH: publicBuildTimeEnv("variable", "environment"),
  NEXT_PUBLIC_ASSET_PREFIX: publicBuildTimeEnv("variable", "repository"),
  NEXT_PUBLIC_ADMIN_IMAGE_HOST: publicBuildTimeEnv("variable", "environment"),
  NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: publicBuildTimeEnv(
    "variable",
    "environment",
  ),
  NEXT_PUBLIC_SECRET_BASE_32: publicBuildTimeEnv("secret", "repository"),
  NEXT_PUBLIC_WHITE_LABEL: publicBuildTimeEnv("variable", "environment"),
} satisfies Record<keyof typeof publicEnvShape, EnvMetadata>;

export const publicEnvSchema = z.object(publicEnvShape).meta({
  id: "publicEnv",
  envMetadata: publicEnvMetadata,
});

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
  }, "FIREBASE_SERVICE_ACCOUNT_JSON must be a valid single-line JSON object.")
  .meta({ validation: "json-object" });

const serverEnvShape = {
  FIREBASE_SERVICE_ACCOUNT_JSON: serviceAccountJsonSchema,
  FIREBASE_SESSION_COOKIE_NAME: z
    .string()
    .trim()
    .min(1, "FIREBASE_SESSION_COOKIE_NAME cannot be empty.")
    .optional()
    .default(DEFAULT_SESSION_COOKIE_NAME),
  FIREBASE_SESSION_COOKIE_SECURE: z.preprocess(
    emptyStringToUndefined,
    z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  ),
  SITE_ACCESS_MODE: siteAccessMode(),
  SITE_ACCESS_LANDING_IMAGE_URL: z.preprocess(
    emptyStringToUndefined,
    z.url().optional(),
  ),
  SITE_ACCESS_LANDING_MOBILE_IMAGE_URL: z.preprocess(
    emptyStringToUndefined,
    z.url().optional(),
  ),
  SITE_ACCESS_ALLOWED_CIDRS: siteAccessAllowedCidrs(),
  SITE_ACCESS_CLIENT_IP_HEADER: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1).optional().default("x-forwarded-for"),
  ),
};

export const serverEnvMetadata = {
  FIREBASE_SERVICE_ACCOUNT_JSON: serverRuntimeEnv("secret", "environment"),
  FIREBASE_SESSION_COOKIE_NAME: serverRuntimeEnv("variable", "repository"),
  FIREBASE_SESSION_COOKIE_SECURE: serverRuntimeEnv("variable", "repository"),
  SITE_ACCESS_MODE: serverRuntimeEnv("variable", "environment"),
  SITE_ACCESS_LANDING_IMAGE_URL: serverRuntimeEnv("variable", "environment"),
  SITE_ACCESS_LANDING_MOBILE_IMAGE_URL: serverRuntimeEnv(
    "variable",
    "environment",
  ),
  SITE_ACCESS_ALLOWED_CIDRS: serverRuntimeEnv("variable", "environment"),
  SITE_ACCESS_CLIENT_IP_HEADER: serverRuntimeEnv("variable", "environment"),
} satisfies Record<keyof typeof serverEnvShape, EnvMetadata>;

export const serverEnvSchema = z.object(serverEnvShape).meta({
  id: "serverEnv",
  envMetadata: serverEnvMetadata,
});
