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
| `NEXT_PUBLIC_SEATS_WORKSPACE_KEY` | Public seats.io workspace key, used by the seat-map renderer.                                                                                                                              | `d88faf51-…`                               |
| `NEXT_PUBLIC_BASE_PATH`           | Prefix prepended to static asset URLs in code (logos, separators, advertisement images). Empty for local dev. Set to the deploy subpath (e.g. `/client`) when the app is hosted under one. | ``(local) /`/client` (deployed)            |
| `NEXT_PUBLIC_SECRET_BASE_32`      | Base32 secret for the QR ticket TOTP timer (`src/hooks/useQrTimer.ts`). Required only for the My Tickets QR flow.                                                                          | (issued per environment)                   |

## Deployment

Container image is built by GitHub Actions (`.github/workflows/deploy-dev.yml`, `deploy-qa.yml`) via the Dockerfile.

All four configuration variables are `NEXT_PUBLIC_*` and are inlined at **build time**, so they must be passed as `--build-arg`s in the Dockerfile and the deploy workflow:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SEATS_WORKSPACE_KEY`
- `NEXT_PUBLIC_BASE_PATH`
- `NEXT_PUBLIC_SECRET_BASE_32`

For local container testing:

```bash
docker compose up --build
```

### GCP Secrets

Runtime configuration is stored in GCP Secret Manager with one secret per environment:

| Secret                       | Contents                              |
| ---------------------------- | ------------------------------------- |
| `dev-xbol-web-client-secret` | The four `NEXT_PUBLIC_*` build values |

Shape:

```json
{
  "NEXT_PUBLIC_API_BASE_URL": "https://dev-api.pwrticket.mx/client/api/",
  "NEXT_PUBLIC_SEATS_WORKSPACE_KEY": "<public seats.io workspace key>",
  "NEXT_PUBLIC_BASE_PATH": "/client",
  "NEXT_PUBLIC_SECRET_BASE_32": "<base32 TOTP secret>"
}
```

To update:

```bash
gcloud secrets versions add dev-xbol-web-client-secret --data-file=- <<'EOF'
{ ... }
EOF
```

QA secrets follow the same pattern with a `qa-` prefix.
