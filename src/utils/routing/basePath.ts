export function normalizeBasePath(basePath?: string): string {
  const trimmedBasePath = basePath?.trim().replace(/^\/+|\/+$/g, "") ?? "";

  return trimmedBasePath ? `/${trimmedBasePath}` : "";
}

export function getPublicAppBasePath(
  basePath = process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX,
): string {
  return normalizeBasePath(basePath) || normalizeBasePath(assetPrefix);
}

export function withBasePath(
  path: string,
  basePath = process.env.NEXT_PUBLIC_BASE_PATH,
): string {
  const normalizedBasePath = normalizeBasePath(basePath);

  if (
    !normalizedBasePath
    || path === normalizedBasePath
    || path.startsWith(`${normalizedBasePath}/`)
  ) {
    return path;
  }

  return `${normalizedBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function withPublicAppBasePath(
  path: string,
  basePath = process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX,
): string {
  return withBasePath(path, getPublicAppBasePath(basePath, assetPrefix));
}

export function withPublicRedirectBasePath(
  path: string,
  basePath = process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX,
): string {
  if (normalizeBasePath(basePath)) {
    return path;
  }

  return withBasePath(path, assetPrefix);
}
