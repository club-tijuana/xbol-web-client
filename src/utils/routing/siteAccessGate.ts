import { getPublicAppBasePath, normalizeBasePath, withBasePath } from "./basePath";

export const SITE_ACCESS_LANDING_PATH = "/landing";

type SiteAccessEnv = {
  SITE_ACCESS_MODE?: string;
  SITE_ACCESS_LANDING_IMAGE_URL?: string;
  NEXT_PUBLIC_BASE_PATH?: string;
  NEXT_PUBLIC_ASSET_PREFIX?: string;
};

export type SiteAccessGateConfig = {
  mode: "open" | "landing";
  landingImageUrl: string | null;
};

const ROOT_PUBLIC_FILES = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

function stripPublicBasePath(pathname: string, publicBasePath: string): string {
  if (!publicBasePath) {
    return pathname;
  }

  if (pathname === publicBasePath) {
    return "/";
  }

  if (pathname.startsWith(`${publicBasePath}/`)) {
    return pathname.slice(publicBasePath.length) || "/";
  }

  return pathname;
}

function isExemptPath(pathname: string): boolean {
  return (
    pathname === SITE_ACCESS_LANDING_PATH
    || pathname.startsWith(`${SITE_ACCESS_LANDING_PATH}/`)
    || pathname === "/api"
    || pathname.startsWith("/api/")
    || pathname === "/healthz"
    || pathname.startsWith("/_next/")
    || pathname.startsWith("/assets/")
    || ROOT_PUBLIC_FILES.has(pathname)
  );
}

export function validateSiteAccessGateEnv(
  env: SiteAccessEnv = process.env,
): SiteAccessGateConfig {
  const mode = env.SITE_ACCESS_MODE === "landing" ? "landing" : "open";
  const landingImageUrl = env.SITE_ACCESS_LANDING_IMAGE_URL?.trim() || null;

  if (mode === "landing" && !landingImageUrl) {
    throw new Error(
      "SITE_ACCESS_LANDING_IMAGE_URL is required when SITE_ACCESS_MODE is landing",
    );
  }

  return {
    mode,
    landingImageUrl,
  };
}

export function getSiteAccessRedirectUrl(
  requestUrl: URL,
  env: SiteAccessEnv = process.env,
): URL | null {
  if (env.SITE_ACCESS_MODE !== "landing") {
    return null;
  }

  const publicBasePath = getPublicAppBasePath(
    env.NEXT_PUBLIC_BASE_PATH,
    env.NEXT_PUBLIC_ASSET_PREFIX,
  );
  const pathname = stripPublicBasePath(
    requestUrl.pathname,
    normalizeBasePath(publicBasePath),
  );

  if (isExemptPath(pathname)) {
    return null;
  }

  const redirectUrl = new URL(requestUrl);
  redirectUrl.pathname = withBasePath(SITE_ACCESS_LANDING_PATH, publicBasePath);
  redirectUrl.search = "";

  return redirectUrl;
}
