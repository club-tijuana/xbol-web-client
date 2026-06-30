import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, extname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { publicEnvSchema } from "../src/config/envContracts.ts";

const DEFAULT_EVENT_IMAGE = "/assets/eventDefault/default.png";
const EVENT_IMAGE_MODULE_URL = new URL(
  "../src/models/event-image.ts",
  import.meta.url,
);
let eventImageImportId = 0;

const requiredPublicEnv = {
  NEXT_PUBLIC_API_BASE_URL: "https://example.test/client/api/",
  NEXT_PUBLIC_SEATS_WORKSPACE_KEY: "d88faf51-0cbb-474e-95d9-3c945a6a279e",
  NEXT_PUBLIC_FIREBASE_API_KEY: "firebase-api-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "example-project",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:abcdef",
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const path = resolve(specifier.replace("@/", "src/"));
      const url = pathToFileURL(path.endsWith(".ts") ? path : `${path}.ts`);

      if (specifier === "@/config/env") {
        url.search = `test=${eventImageImportId}`;
      }

      return nextResolve(url.href, context);
    }

    if (
      specifier.startsWith(".")
      && !extname(specifier)
      && context.parentURL
    ) {
      const parentPath = fileURLToPath(context.parentURL);
      const path = resolve(dirname(parentPath), `${specifier}.ts`);

      if (existsSync(path)) {
        return nextResolve(pathToFileURL(path).href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

async function importEventImageModule() {
  eventImageImportId += 1;

  return import(`${EVENT_IMAGE_MODULE_URL.href}?test=${eventImageImportId}`);
}

async function withPublicEnv(
  env: Partial<NodeJS.ProcessEnv>,
  callback: () => Promise<void>,
) {
  const nextEnv = {
    ...requiredPublicEnv,
    ...env,
  };
  const previousEnv = Object.fromEntries(
    Object.keys(nextEnv).map((key) => [key, process.env[key]]),
  );

  for (const [key, value] of Object.entries(nextEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    await callback();
  } finally {
    for (const [key, value] of Object.entries(previousEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

test("public env schema defaults the event image to the checked-in asset", () => {
  const env = publicEnvSchema.parse(requiredPublicEnv);

  assert.equal(env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE, DEFAULT_EVENT_IMAGE);
});

test("public env schema keeps email auth disabled by default", () => {
  const env = publicEnvSchema.parse(requiredPublicEnv);

  assert.equal(env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH, false);
});

test("public env schema allows explicitly enabling email auth", () => {
  const env = publicEnvSchema.parse({
    ...requiredPublicEnv,
    NEXT_PUBLIC_ENABLE_EMAIL_AUTH: "true",
  });

  assert.equal(env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH, true);
});

test("public env schema accepts the deployment override as provided", () => {
  const defaultImage = "event-default-from-deploy.png";
  const env = publicEnvSchema.parse({
    ...requiredPublicEnv,
    NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: defaultImage,
  });

  assert.equal(env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE, defaultImage);
});

test("event image fallback includes the configured base path", async () => {
  await withPublicEnv({
    NEXT_PUBLIC_BASE_PATH: " /client/ ",
    NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: undefined,
  }, async () => {
    const { eventImageOrDefault } = await importEventImageModule();

    assert.equal(
      eventImageOrDefault(),
      "/client/assets/eventDefault/default.png",
    );
    assert.equal(
      eventImageOrDefault("   "),
      "/client/assets/eventDefault/default.png",
    );
  });
});

test("event image fallback leaves provided event images unchanged", async () => {
  await withPublicEnv({
    NEXT_PUBLIC_BASE_PATH: "/client",
    NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: undefined,
  }, async () => {
    const { eventImageOrDefault } = await importEventImageModule();

    assert.equal(
      eventImageOrDefault("https://media.example.test/event.png"),
      "https://media.example.test/event.png",
    );
  });
});

test("event image fallback leaves deployment overrides unchanged", async () => {
  await withPublicEnv({
    NEXT_PUBLIC_BASE_PATH: "/client",
    NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: "/custom-default.png",
  }, async () => {
    const { eventImageOrDefault } = await importEventImageModule();

    assert.equal(eventImageOrDefault(), "/custom-default.png");
  });
});

test("hero image fallback prefers the landing image over the default event image", async () => {
  await withPublicEnv({
    NEXT_PUBLIC_BASE_PATH: "/client",
    NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: undefined,
  }, async () => {
    const { heroImageOrDefault } = await importEventImageModule();

    assert.equal(
      heroImageOrDefault("", "https://storage.googleapis.com/example/landing.png"),
      "https://storage.googleapis.com/example/landing.png",
    );
    assert.equal(
      heroImageOrDefault("https://media.example.test/event.png", "https://storage.googleapis.com/example/landing.png"),
      "https://media.example.test/event.png",
    );
    assert.equal(
      heroImageOrDefault("", ""),
      "/client/assets/eventDefault/default.png",
    );
  });
});

test("default event image does not use a feature-specific resolver module", () => {
  assert.equal(existsSync("src/config/defaultEventImage.ts"), false);
});

test("event image components do not import the default image config directly", () => {
  const componentPaths = [
    "src/components/EventCard/EventCard.tsx",
    "src/app/event/components/EventsSearch/EventsSearch.tsx",
    "src/app/booking/components/BookingClient/BookingClient.tsx",
    "src/app/booking/components/BookingSeasonClient/BookingSeasonClient.tsx",
    "src/app/account/tickets/components/TicketCard/TicketCard.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketPageClient/TicketPageClient.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketQRGridItem/TicketQRGridItem.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/CarouselSlideQRTickets/CarouselSlideQRTicket.tsx",
    "src/app/account/tickets/order/[orderId]/success/components/SuccessClient/SuccessClient.tsx",
  ];

  for (const path of componentPaths) {
    const source = readFileSync(path, "utf8");

    assert.equal(source.includes("defaultEventImage"), false, path);
  }
});
