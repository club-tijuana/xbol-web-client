FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SEATS_WORKSPACE_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SEATS_WORKSPACE_KEY=$NEXT_PUBLIC_SEATS_WORKSPACE_KEY

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

ARG DOCKER_IMAGE_VERSION
ENV DOCKER_IMAGE_VERSION=${DOCKER_IMAGE_VERSION}

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
