import type { z } from "zod";

import { publicEnvSchema } from "./envContracts";

export {
  publicEnvMetadata,
  publicEnvSchema,
} from "./envContracts";

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
  NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TESTING:
    process.env.NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TESTING,
  NEXT_PUBLIC_ENABLE_EMAIL_AUTH: process.env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  NEXT_PUBLIC_ADMIN_IMAGE_HOST: process.env.NEXT_PUBLIC_ADMIN_IMAGE_HOST,
  NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: process.env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE,
  NEXT_PUBLIC_SECRET_BASE_32: process.env.NEXT_PUBLIC_SECRET_BASE_32,
  NEXT_PUBLIC_WHITE_LABEL: process.env.NEXT_PUBLIC_WHITE_LABEL,
});
