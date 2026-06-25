import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, extname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { serverEnvSchema } from "../src/config/envContracts.ts";

const SITE_ACCESS_GATE_MODULE = "src/utils/routing/siteAccessGate.ts";

registerHooks({
  resolve(specifier, context, nextResolve) {
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

async function importSiteAccessGate() {
  assert.equal(
    existsSync(SITE_ACCESS_GATE_MODULE),
    true,
    "site access gate helper should exist",
  );

  return import(
    `${pathToFileURL(SITE_ACCESS_GATE_MODULE).href}?test=${Date.now()}`
  );
}

test("server env schema accepts the landing gate runtime configuration", () => {
  const env = serverEnvSchema.parse({
    FIREBASE_SERVICE_ACCOUNT_JSON: "{\"type\":\"service_account\"}",
    SITE_ACCESS_MODE: "landing",
    SITE_ACCESS_LANDING_IMAGE_URL:
      "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
  });

  assert.equal(env.SITE_ACCESS_MODE, "landing");
  assert.equal(
    env.SITE_ACCESS_LANDING_IMAGE_URL,
    "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
  );
});

test("server env schema defaults the landing gate to open", () => {
  const env = serverEnvSchema.parse({
    FIREBASE_SERVICE_ACCOUNT_JSON: "{\"type\":\"service_account\"}",
  });

  assert.equal(env.SITE_ACCESS_MODE, "open");
});

test("site access gate requires a landing image URL in landing mode", async () => {
  const { validateSiteAccessGateEnv } = await importSiteAccessGate();

  assert.throws(
    () => validateSiteAccessGateEnv({ SITE_ACCESS_MODE: "landing" }),
    /SITE_ACCESS_LANDING_IMAGE_URL is required when SITE_ACCESS_MODE is landing/,
  );
});

test("site access gate does not redirect when the mode is open", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();

  const redirectUrl = getSiteAccessRedirectUrl(
    new URL("https://qa-web.pwrticket.mx/client/event/123"),
    {
      SITE_ACCESS_MODE: "open",
      NEXT_PUBLIC_ASSET_PREFIX: "/client",
    },
  );

  assert.equal(redirectUrl, null);
});

test("site access gate redirects page requests to the public landing route", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();

  const redirectUrl = getSiteAccessRedirectUrl(
    new URL("https://qa-web.pwrticket.mx/client/event/123?foo=bar"),
    {
      SITE_ACCESS_MODE: "landing",
      NEXT_PUBLIC_ASSET_PREFIX: "/client",
    },
  );

  assert.equal(redirectUrl?.toString(), "https://qa-web.pwrticket.mx/client/landing");
});

test("site access gate leaves landing page and infrastructure paths reachable", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();
  const env = {
    SITE_ACCESS_MODE: "landing",
    NEXT_PUBLIC_ASSET_PREFIX: "/client",
  };
  const exemptPaths = [
    "/landing",
    "/api/auth/session",
    "/healthz",
    "/_next/static/chunk.js",
    "/_next/image",
    "/assets/logo.svg",
    "/favicon.ico",
  ];

  for (const path of exemptPaths) {
    const redirectUrl = getSiteAccessRedirectUrl(
      new URL(`https://qa-web.pwrticket.mx/client${path}`),
      env,
    );

    assert.equal(redirectUrl, null, path);
  }
});
