#!/bin/bash

.PHONY: help run stop restart build logs health shell dev lint web-build network

DOCKER_FE = xbol-web-client
UID = $(shell id -u)

# Auto-detect container runtime (podman or docker)
CONTAINER_RUNTIME := $(shell command -v podman 2>/dev/null || command -v docker 2>/dev/null)
ifeq ($(CONTAINER_RUNTIME),)
$(error Neither podman nor docker found in PATH)
endif

# Auto-detect compose command (podman-compose, podman compose, or docker compose)
COMPOSE_CMD := $(shell \
	if command -v podman-compose >/dev/null 2>&1; then \
		echo "podman-compose"; \
	elif podman compose version >/dev/null 2>&1; then \
		echo "podman compose"; \
	elif docker compose version >/dev/null 2>&1; then \
		echo "docker compose"; \
	else \
		echo "docker-compose"; \
	fi)

# Set --format docker for Podman to support HEALTHCHECK
BUILD_FORMAT := $(shell \
	if echo $(COMPOSE_CMD) | grep -q podman; then \
		echo '--podman-build-args "--format docker"'; \
	else \
		echo ""; \
	fi)

help: ## Show this help message
	@echo 'usage: make [target]'
	@echo
	@echo 'targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' ${MAKEFILE_LIST} | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run: network ## Start the containers
	${COMPOSE_CMD} up -d

stop: ## Stop the containers
	${COMPOSE_CMD} stop

restart: ## Restart the containers
	$(MAKE) stop && $(MAKE) run

build: ## Rebuild all the containers
	${COMPOSE_CMD} ${BUILD_FORMAT} build

network: ## Create the shared xbol-network (idempotent)
	@${CONTAINER_RUNTIME} network inspect xbol-network >/dev/null 2>&1 || ${CONTAINER_RUNTIME} network create xbol-network

logs: ## Follow web-client logs
	${CONTAINER_RUNTIME} logs -f ${DOCKER_FE}

health: ## Check /healthz endpoint
	@curl -fsS "http://localhost:3000$${NEXT_PUBLIC_BASE_PATH}/healthz" && echo "" || echo "Health check failed"

shell: ## Open a shell in the web-client container
	${CONTAINER_RUNTIME} exec -it ${DOCKER_FE} sh

dev: ## Start Next.js dev server (host, no container)
	npm run dev

lint: ## Run ESLint
	npm run lint

web-build: ## Build Next.js production bundle on host
	npm run build
