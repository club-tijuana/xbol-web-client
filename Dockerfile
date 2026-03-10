# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time environment variables used by Next.js (must be set at build time)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SEATS_WORKSPACE_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SEATS_WORKSPACE_KEY=$NEXT_PUBLIC_SEATS_WORKSPACE_KEY

# Install dependencies (use lockfile for reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy runtime artifacts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]
