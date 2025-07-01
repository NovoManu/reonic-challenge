.PHONY: dev-backend build-backend migrate-backend generate-backend

dev:
	npm run dev:all

dev-backend:
	npm run dev:backend

build-backend:
	npm run build:backend

migrate-backend:
	npm run migrate:backend

generate-backend:
	npm run generate:backend

dev-frontend:
	npm run dev:frontend

build-frontend:
	npm run build:frontend

lint-frontend:
	npm run lint:frontend

preview-frontend:
	npm run preview:frontend

info:
	@grep -E '^[a-zA-Z0-9_-]+:.*?' Makefile | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "%-20s %s\n", $$1, $$2}'		