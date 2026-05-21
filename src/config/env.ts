import { z } from "zod";

const requiredString = (name: string) =>
  z.string().trim().min(1, `${name} is required.`);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: requiredString("NEXT_PUBLIC_API_BASE_URL").pipe(
    z.url({
      message: "NEXT_PUBLIC_API_BASE_URL must be a valid URL.",
    }),
  ),
  NEXT_PUBLIC_SEATS_WORKSPACE_KEY: requiredString(
    "NEXT_PUBLIC_SEATS_WORKSPACE_KEY",
  ).pipe(
    z.uuid({
      message: "NEXT_PUBLIC_SEATS_WORKSPACE_KEY must be a UUID",
    }),
  ),
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
  NEXT_PUBLIC_FIREBASE_TENANT_ID: requiredString(
    "NEXT_PUBLIC_FIREBASE_TENANT_ID",
  ),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_BASE_PATH: z.string().optional(),
  NEXT_PUBLIC_ASSET_PREFIX: z.string().optional(),
  NEXT_PUBLIC_ADMIN_IMAGE_HOST: z.string().optional(),
  NEXT_PUBLIC_SECRET_BASE_32: z.string().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

type PublicEnvInput = {
  [Key in keyof z.input<typeof publicEnvSchema>]: string | undefined;
};

export function validatePublicEnv(env: PublicEnvInput): PublicEnv {
  return publicEnvSchema.parse(env);
}

export const publicEnv = validatePublicEnv({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_SEATS_WORKSPACE_KEY: process.env.NEXT_PUBLIC_SEATS_WORKSPACE_KEY,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_TENANT_ID: process.env.NEXT_PUBLIC_FIREBASE_TENANT_ID,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  NEXT_PUBLIC_ADMIN_IMAGE_HOST: process.env.NEXT_PUBLIC_ADMIN_IMAGE_HOST,
  NEXT_PUBLIC_SECRET_BASE_32: process.env.NEXT_PUBLIC_SECRET_BASE_32,
});
