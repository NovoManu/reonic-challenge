.PHONY: help install dev test clean
.DEFAULT_GOAL := help

# Colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

## —— 🚀 Project ———————————————————————————————————————————————————————————————
# Root commands that handle everything
install: install-root install-backend install-frontend ## Install all dependencies (root + workspaces)

install-root: ## Install root dependencies only
	npm install

clean: clean-root clean-backend clean-frontend ## Remove all build artifacts and dependencies (root + workspaces)

clean-root: ## Clean root artifacts only
	rm -rf node_modules
	rm -rf dist
	rm -rf .next

# Workspace-specific commands
install-backend: ## Install backend dependencies and generate Prisma client
	npm install --workspace=backend
	npm run generate:backend

install-frontend: ## Install frontend dependencies only
	npm install --workspace=frontend

clean-backend: ## Clean backend artifacts only
	rm -rf backend/node_modules
	rm -rf backend/dist
	rm -rf backend/.next
	rm -rf backend/coverage

clean-frontend: ## Clean frontend artifacts only
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	rm -rf frontend/.next

## —— 🛠️  Backend ————————————————————————————————————————————————————————————
start-db: ## Start PostgreSQL database using Docker
	cd backend && docker-compose up -d

stop-db: ## Stop PostgreSQL database container
	cd backend && docker-compose down

dev-backend: ## Start backend in development mode
	npm run dev:backend

build-backend: ## Build backend for production
	npm run build:backend

migrate-backend: ## Run database migrations
	npm run migrate:backend

generate-backend: ## Generate backend types and clients
	npm run generate:backend

test-backend: ## Run backend tests
	npm test --workspace=backend

## —— 💻 Frontend ————————————————————————————————————————————————————————————
dev-frontend: ## Start frontend in development mode
	npm run dev:frontend

build-frontend: ## Build frontend for production
	npm run build:frontend

lint-frontend: ## Lint frontend code
	npm run lint:frontend

preview-frontend: ## Preview production build locally
	npm run preview:frontend

test-frontend: ## Run frontend tests
	npm test --workspace=frontend

## —— 🏗️  Full Stack —————————————————————————————————————————————————————————
dev: ## Start both frontend and backend in development mode
	npm run dev:all

build: build-backend build-frontend ## Build both frontend and backend

test: test-backend test-frontend ## Run all tests

## —— 🛠️  Help ——————————————————————————————————————————————————————————————
help: ## Show this help
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "  ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2}' $(MAKEFILE_LIST) | sort