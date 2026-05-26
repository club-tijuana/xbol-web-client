# XBOL Web Client

Public-facing Next.js client for the XBOL ticketing platform.

## Development Setup

### Requirements

- Node.js (matches the version pinned by `package.json` engines / Next.js 16)
- npm
- A reachable XBOL Client API (local instance from [`xbol-api-client`](../xbol-api-client) or a deployed environment)

### Quick Start

```bash
npm install
cp .env.example .env.development   # then fill in values (see Environment variables)
npm run dev
```

App runs at <http://localhost:3000>.

### Build & Lint

```bash
npm run build   # production build (output: standalone)
npm run lint    # ESLint: next/core-web-vitals + typescript + import order
```

There is no test runner configured.

## Environment variables

All client-exposed variables use the `NEXT_PUBLIC_` prefix and are inlined at build time. `env.d.ts` is the source of truth for required keys.

| Variable                          | Purpose                                                                                                                                                                                    | Example                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`        | Base URL for the Client API. Must include the trailing slash — services append relative paths (`events`, `events/main`, `events/{id}`).                                                    | `https://dev-api.pwrticket.mx/client/api/` |
| `NEXT_PUBLIC_SEATS_WORKSPACE_KEY` | Public seats.io workspace key, used by the seat-map renderer.                                                                                                                              | `d88faf51-...`                             |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web SDK API key for Client auth. | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain for Client auth. | `boletera-qa.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project id for Client auth. | `boletera-qa` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app id for Client Web. | `1:313175547904:web:...` |
| `NEXT_PUBLIC_FIREBASE_TENANT_ID` | Google Cloud Identity Platform tenant id for Client identities. | `client-44m3w` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Optional Firebase messaging sender id from the web app config. | `313175547904` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Optional Firebase storage bucket from the web app config. | `boletera-qa.firebasestorage.app` |
| `NEXT_PUBLIC_BASE_PATH`           | Feeds Next's `basePath` — prefixes application routes. Leave empty when the gateway strips the subpath before forwarding to the upstream (current APISIX setup). Populate only if the app must answer at a subpath without upstream stripping.                                                  | `` (current deploy)                        |
| `NEXT_PUBLIC_ASSET_PREFIX`        | Feeds Next's `assetPrefix` — prefixes asset URLs (`_next/static`, `_next/image`, etc.) without prefixing routes. Set to the public subpath the gateway exposes so the browser requests assets through the gateway.                                                                              | `` (local) / `/client` (deployed)          |
| `NEXT_PUBLIC_SECRET_BASE_32`      | Base32 secret for the QR ticket TOTP timer (`src/hooks/useQrTimer.ts`). Required only for the My Tickets QR flow.                                                                          | (issued per environment)                   |

Server-only variables:

| Variable                         | Purpose                                                                                                  | Example                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------- |
| `FIREBASE_SERVICE_ACCOUNT_JSON`  | Firebase service account JSON content for the Admin SDK session-cookie route handlers.                    | `{"type":"service_account",...}` |
| `FIREBASE_SESSION_COOKIE_NAME`   | Optional HttpOnly session cookie name override.                                                          | `xbol_client_session`  |
| `FIREBASE_SESSION_COOKIE_SECURE` | Optional local HTTP override for the cookie `Secure` flag. Leave unset in deployed HTTPS environments.   | `false`                |

For local development, put the service account JSON in `.env.development` as a single-line value:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

## Deployment

Container image is built by GitHub Actions (`.github/workflows/deploy-dev.yml`, `deploy-qa.yml`) via the Dockerfile.

Client-exposed `NEXT_PUBLIC_*` variables are inlined at **build time**, so they must be passed as `--build-arg`s in the Dockerfile and the deploy workflow:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SEATS_WORKSPACE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_TENANT_ID`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_BASE_PATH`
- `NEXT_PUBLIC_ASSET_PREFIX`
- `NEXT_PUBLIC_SECRET_BASE_32`

Server-only Firebase Admin SDK variables are read at **runtime** by the standalone Next.js server:

- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_SESSION_COOKIE_NAME`
- `FIREBASE_SESSION_COOKIE_SECURE`

For local container testing:

```bash
docker compose up --build
```

### GCP Secrets

Runtime configuration is stored in GCP Secret Manager with one secret per environment:

| Secret                       | Contents                                     |
| ---------------------------- | -------------------------------------------- |
| `dev-xbol-web-client-secret` | Build-time public values and runtime secrets |

Shape:

```json
{
  "NEXT_PUBLIC_API_BASE_URL": "https://dev-api.pwrticket.mx/client/api/",
  "NEXT_PUBLIC_SEATS_WORKSPACE_KEY": "<public seats.io workspace key>",
  "NEXT_PUBLIC_FIREBASE_API_KEY": "<Firebase Web SDK API key>",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "boletera-qa.firebaseapp.com",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "boletera-qa",
  "NEXT_PUBLIC_FIREBASE_APP_ID": "<Firebase Web SDK app id>",
  "NEXT_PUBLIC_FIREBASE_TENANT_ID": "client-44m3w",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "313175547904",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "boletera-qa.firebasestorage.app",
  "NEXT_PUBLIC_BASE_PATH": "",
  "NEXT_PUBLIC_ASSET_PREFIX": "/client",
  "NEXT_PUBLIC_SECRET_BASE_32": "<base32 TOTP secret>",
  "FIREBASE_SERVICE_ACCOUNT_JSON": "<single-line service account JSON>",
  "FIREBASE_SESSION_COOKIE_NAME": "xbol_client_session"
}
```

To update:

```bash
gcloud secrets versions add dev-xbol-web-client-secret --data-file=- <<'EOF'
{ ... }
EOF
```

QA secrets follow the same pattern with a `qa-` prefix.
