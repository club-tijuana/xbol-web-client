import { getPublicAppBasePath, normalizeBasePath, withBasePath } from "./basePath";

export const SITE_ACCESS_LANDING_PATH = "/landing";

type SiteAccessEnv = {
  SITE_ACCESS_MODE?: string;
  SITE_ACCESS_LANDING_IMAGE_URL?: string;
  SITE_ACCESS_LANDING_MOBILE_IMAGE_URL?: string;
  SITE_ACCESS_ALLOWED_CIDRS?: string;
  SITE_ACCESS_CLIENT_IP_HEADER?: string;
  NEXT_PUBLIC_BASE_PATH?: string;
  NEXT_PUBLIC_ASSET_PREFIX?: string;
};

export type SiteAccessGateConfig = {
  mode: "open" | "landing";
  landingImageUrl: string | null;
  landingMobileImageUrl: string | null;
  allowedCidrs: string[];
  clientIpHeader: string;
};

const ROOT_PUBLIC_FILES = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

const DEFAULT_CLIENT_IP_HEADER = "x-forwarded-for";
const TRUSTED_PROXY_CIDRS = [
  "35.191.0.0/16",
  "130.211.0.0/22",
];

type Ipv4Range = {
  base: number;
  mask: number;
};

type SiteAccessGateConfigOptions = {
  requireLandingImage: boolean;
};

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

function splitAllowedCidrs(value?: string): string[] {
  return value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];
}

function parseIpv4Address(value: string): number | null {
  const parts = value.trim().split(".");

  if (parts.length !== 4) {
    return null;
  }

  let parsed = 0;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) {
      return null;
    }

    const octet = Number(part);
    if (octet < 0 || octet > 255) {
      return null;
    }

    parsed = (parsed << 8) + octet;
  }

  return parsed >>> 0;
}

function parseIpv4Range(value: string): Ipv4Range | null {
  const parts = value.split("/");
  if (parts.length > 2) {
    return null;
  }

  const [address, prefixValue] = parts;
  const prefixLength = prefixValue === undefined ? 32 : Number(prefixValue);

  if (
    !Number.isInteger(prefixLength)
    || prefixLength < 0
    || prefixLength > 32
  ) {
    return null;
  }

  const parsedAddress = parseIpv4Address(address);
  if (parsedAddress === null) {
    return null;
  }

  const mask = prefixLength === 0
    ? 0
    : (0xffffffff << (32 - prefixLength)) >>> 0;

  return {
    base: (parsedAddress & mask) >>> 0,
    mask,
  };
}

function getForwardedIpChain(headers: Headers, headerName: string): string[] {
  return headers.get(headerName)
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];
}

function isIpInRange(ipAddress: number, cidr: string): boolean {
  const range = parseIpv4Range(cidr);

  return range !== null && ((ipAddress & range.mask) >>> 0) === range.base;
}

function isTrustedProxyIp(ipAddress: number): boolean {
  return TRUSTED_PROXY_CIDRS.some((trustedProxyCidr) => (
    isIpInRange(ipAddress, trustedProxyCidr)
  ));
}

function getClientIp(headers: Headers, headerName: string): string | null {
  const chain = getForwardedIpChain(headers, headerName);
  const publicClientIp = chain.find((entry) => {
    const parsedIp = parseIpv4Address(entry);

    return parsedIp !== null && !isTrustedProxyIp(parsedIp);
  });

  return publicClientIp ?? chain[0] ?? null;
}

function isAllowedClientIp(
  headers: Headers | undefined,
  allowedCidrs: string[],
  clientIpHeader: string,
): boolean {
  if (!headers || allowedCidrs.length === 0) {
    return false;
  }

  const clientIp = getClientIp(headers, clientIpHeader);
  if (!clientIp) {
    return false;
  }

  const parsedClientIp = parseIpv4Address(clientIp);
  if (parsedClientIp === null) {
    return false;
  }

  return allowedCidrs.some((allowedCidr) => {
    const range = parseIpv4Range(allowedCidr);

    return range !== null && ((parsedClientIp & range.mask) >>> 0) === range.base;
  });
}

function parseSiteAccessGateEnv(
  env: SiteAccessEnv = process.env,
  options: SiteAccessGateConfigOptions,
): SiteAccessGateConfig {
  const mode = env.SITE_ACCESS_MODE === "landing" ? "landing" : "open";
  const landingImageUrl = env.SITE_ACCESS_LANDING_IMAGE_URL?.trim() || null;
  const landingMobileImageUrl =
    env.SITE_ACCESS_LANDING_MOBILE_IMAGE_URL?.trim() || null;
  const allowedCidrs = splitAllowedCidrs(env.SITE_ACCESS_ALLOWED_CIDRS);
  const clientIpHeader =
    env.SITE_ACCESS_CLIENT_IP_HEADER?.trim().toLowerCase()
      || DEFAULT_CLIENT_IP_HEADER;

  if (options.requireLandingImage && mode === "landing" && !landingImageUrl) {
    throw new Error(
      "SITE_ACCESS_LANDING_IMAGE_URL is required when SITE_ACCESS_MODE is landing",
    );
  }

  const invalidAllowedCidr = allowedCidrs.find(
    (allowedCidr) => parseIpv4Range(allowedCidr) === null,
  );
  if (invalidAllowedCidr) {
    throw new Error(
      `SITE_ACCESS_ALLOWED_CIDRS contains an invalid IPv4 CIDR or address: ${invalidAllowedCidr}`,
    );
  }

  return {
    mode,
    landingImageUrl,
    landingMobileImageUrl,
    allowedCidrs,
    clientIpHeader,
  };
}

export function validateSiteAccessGateEnv(
  env: SiteAccessEnv = process.env,
): SiteAccessGateConfig {
  return parseSiteAccessGateEnv(env, { requireLandingImage: true });
}

export function getSiteAccessLandingImages(
  env: SiteAccessEnv = process.env,
): Pick<SiteAccessGateConfig, "landingImageUrl" | "landingMobileImageUrl"> {
  const config = parseSiteAccessGateEnv(env, { requireLandingImage: false });

  return {
    landingImageUrl: config.landingImageUrl,
    landingMobileImageUrl: config.landingMobileImageUrl,
  };
}

export function getSiteAccessDiagnosticHeaders(
  env: SiteAccessEnv = process.env,
  headers?: Headers,
): Record<string, string> {
  const config = parseSiteAccessGateEnv(env, { requireLandingImage: false });
  const forwardedChain = headers
    ? getForwardedIpChain(headers, config.clientIpHeader).join(", ")
    : "";
  const clientIp = headers
    ? getClientIp(headers, config.clientIpHeader)
    : null;

  return {
    "x-site-access-client-ip-header": config.clientIpHeader,
    "x-site-access-seen-ip": clientIp ?? "",
    "x-site-access-forwarded-chain": forwardedChain,
  };
}

export function getSiteAccessRedirectUrl(
  requestUrl: URL,
  env: SiteAccessEnv = process.env,
  headers?: Headers,
): URL | null {
  if (env.SITE_ACCESS_MODE !== "landing") {
    return null;
  }

  const config = parseSiteAccessGateEnv(env, { requireLandingImage: false });

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

  if (
    isAllowedClientIp(
      headers,
      config.allowedCidrs,
      config.clientIpHeader,
    )
  ) {
    return null;
  }

  const redirectUrl = new URL(requestUrl);
  redirectUrl.pathname = withBasePath(SITE_ACCESS_LANDING_PATH, publicBasePath);
  redirectUrl.search = "";

  return redirectUrl;
}
