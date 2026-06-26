import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
    SITE_ACCESS_LANDING_MOBILE_IMAGE_URL:
      "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon-mobile.png",
  });

  assert.equal(env.SITE_ACCESS_MODE, "landing");
  assert.equal(
    env.SITE_ACCESS_LANDING_IMAGE_URL,
    "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
  );
  assert.equal(
    env.SITE_ACCESS_LANDING_MOBILE_IMAGE_URL,
    "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon-mobile.png",
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

test("site access gate exposes an optional mobile landing image URL", async () => {
  const { validateSiteAccessGateEnv } = await importSiteAccessGate();

  const config = validateSiteAccessGateEnv({
    SITE_ACCESS_MODE: "landing",
    SITE_ACCESS_LANDING_IMAGE_URL:
      "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
    SITE_ACCESS_LANDING_MOBILE_IMAGE_URL:
      "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon-mobile.png",
  });

  assert.equal(
    config.landingImageUrl,
    "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
  );
  assert.equal(
    config.landingMobileImageUrl,
    "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon-mobile.png",
  );
});

test("site access gate leaves the mobile landing image unset when not configured", async () => {
  const { validateSiteAccessGateEnv } = await importSiteAccessGate();

  const config = validateSiteAccessGateEnv({
    SITE_ACCESS_MODE: "landing",
    SITE_ACCESS_LANDING_IMAGE_URL:
      "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
  });

  assert.equal(config.landingMobileImageUrl, null);
});

test("site access gate exposes landing images without requiring landing mode", async () => {
  const { getSiteAccessLandingImages } = await importSiteAccessGate();

  const config = getSiteAccessLandingImages({
    SITE_ACCESS_MODE: "open",
    SITE_ACCESS_LANDING_IMAGE_URL:
      "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
    SITE_ACCESS_LANDING_MOBILE_IMAGE_URL:
      "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon-mobile.png",
  });

  assert.equal(
    config.landingImageUrl,
    "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon.png",
  );
  assert.equal(
    config.landingMobileImageUrl,
    "https://storage.googleapis.com/example-bucket/public-media/static/xolopass-coming-soon-mobile.png",
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

test("site access gate lets allowlisted exact IPv4 addresses through", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();

  const redirectUrl = getSiteAccessRedirectUrl(
    new URL("https://qa-web.pwrticket.mx/client/event/123"),
    {
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_ALLOWED_CIDRS: "203.0.113.10",
      NEXT_PUBLIC_ASSET_PREFIX: "/client",
    },
    new Headers({
      "x-forwarded-for": "203.0.113.10",
    }),
  );

  assert.equal(redirectUrl, null);
});

test("site access gate lets allowlisted IPv4 CIDR ranges through", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();

  const redirectUrl = getSiteAccessRedirectUrl(
    new URL("https://qa-web.pwrticket.mx/client/event/123"),
    {
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_ALLOWED_CIDRS: "198.51.100.0/24",
      NEXT_PUBLIC_ASSET_PREFIX: "/client",
    },
    new Headers({
      "x-forwarded-for": "198.51.100.42, 10.0.0.1",
    }),
  );

  assert.equal(redirectUrl, null);
});

test("site access gate ignores trusted proxy IPs in forwarded chains", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();

  const redirectUrl = getSiteAccessRedirectUrl(
    new URL("https://qa-web.pwrticket.mx/client/event/123"),
    {
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_ALLOWED_CIDRS: "187.250.14.36/32",
      NEXT_PUBLIC_ASSET_PREFIX: "/client",
    },
    new Headers({
      "x-forwarded-for": "35.191.6.75, 187.250.14.36",
    }),
  );

  assert.equal(redirectUrl, null);
});

test("site access gate redirects non-allowlisted IPs", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();

  const redirectUrl = getSiteAccessRedirectUrl(
    new URL("https://qa-web.pwrticket.mx/client/event/123"),
    {
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_ALLOWED_CIDRS: "198.51.100.0/24",
      NEXT_PUBLIC_ASSET_PREFIX: "/client",
    },
    new Headers({
      "x-forwarded-for": "203.0.113.10",
    }),
  );

  assert.equal(redirectUrl?.toString(), "https://qa-web.pwrticket.mx/client/landing");
});

test("site access gate supports configured client IP headers", async () => {
  const { getSiteAccessRedirectUrl } = await importSiteAccessGate();

  const redirectUrl = getSiteAccessRedirectUrl(
    new URL("https://qa-web.pwrticket.mx/client/event/123"),
    {
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_ALLOWED_CIDRS: "203.0.113.10",
      SITE_ACCESS_CLIENT_IP_HEADER: "x-client-ip",
      NEXT_PUBLIC_ASSET_PREFIX: "/client",
    },
    new Headers({
      "x-forwarded-for": "198.51.100.42",
      "x-client-ip": "203.0.113.10",
    }),
  );

  assert.equal(redirectUrl, null);
});

test("site access gate diagnostics report the configured header and seen IP", async () => {
  const { getSiteAccessDiagnosticHeaders } = await importSiteAccessGate();

  const diagnosticHeaders = getSiteAccessDiagnosticHeaders(
    {
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_ALLOWED_CIDRS: "203.0.113.10",
      SITE_ACCESS_CLIENT_IP_HEADER: "x-forwarded-for",
    },
    new Headers({
      "x-forwarded-for": "198.51.100.42, 10.0.0.1",
    }),
  );

  assert.deepEqual(diagnosticHeaders, {
    "x-site-access-client-ip-header": "x-forwarded-for",
    "x-site-access-seen-ip": "198.51.100.42",
    "x-site-access-forwarded-chain": "198.51.100.42, 10.0.0.1",
  });
});

test("site access gate diagnostics report missing client IP headers", async () => {
  const { getSiteAccessDiagnosticHeaders } = await importSiteAccessGate();

  const diagnosticHeaders = getSiteAccessDiagnosticHeaders(
    {
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_ALLOWED_CIDRS: "203.0.113.10",
    },
    new Headers(),
  );

  assert.deepEqual(diagnosticHeaders, {
    "x-site-access-client-ip-header": "x-forwarded-for",
    "x-site-access-seen-ip": "",
    "x-site-access-forwarded-chain": "",
  });
});

test("site access gate requires valid allowlisted IPv4 CIDRs", async () => {
  const { validateSiteAccessGateEnv } = await importSiteAccessGate();

  assert.throws(
    () => validateSiteAccessGateEnv({
      SITE_ACCESS_MODE: "landing",
      SITE_ACCESS_LANDING_IMAGE_URL: "https://storage.googleapis.com/example/image.png",
      SITE_ACCESS_ALLOWED_CIDRS: "203.0.113.10, 198.51.100.0/33",
    }),
    /SITE_ACCESS_ALLOWED_CIDRS contains an invalid IPv4 CIDR or address/,
  );
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

test("landing page is dynamic so it can read runtime image configuration", () => {
  const source = readFileSync("src/app/landing/page.tsx", "utf8");

  assert.match(source, /export const dynamic = "force-dynamic"/);
});

test("landing page uses a mobile art-directed source when configured", () => {
  const source = readFileSync("src/app/landing/page.tsx", "utf8");

  assert.match(source, /landingMobileImageUrl/);
  assert.match(source, /<picture/);
  assert.match(source, /media="\(max-width: 767px\)"/);
});
