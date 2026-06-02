type DecodedFirebaseTokenClaims = {
  firebase?: {
    tenant?: unknown;
    [claim: string]: unknown;
  };
};

export function assertRootFirebaseDecodedToken(
  decodedToken: DecodedFirebaseTokenClaims,
): void {
  const tenant = decodedToken.firebase?.tenant;
  if (typeof tenant === "string" && tenant.trim()) {
    throw new Error("A valid root Firebase client ID token is required.");
  }
}
