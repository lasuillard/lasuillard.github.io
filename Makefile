#!/usr/bin/env -S make -f

MAKEFLAGS += --warn-undefined-variable
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --silent

-include Makefile.*

SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
.DEFAULT_GOAL := help

help: Makefile  ## Show help
	for makefile in $(MAKEFILE_LIST)
	do
		@echo "$${makefile}"
		@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' "$${makefile}" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
	done


# =============================================================================
# Common
# =============================================================================
install:  ## Install the app locally
	pnpm install
.PHONY: install

init:  ## Initialize project repository
	pre-commit autoupdate
	pre-commit install --install-hooks --hook-type pre-commit --hook-type commit-msg
.PHONY: init

run:  ## Run development application
	pnpm run dev $$([ -z "$$CONTAINER" ] && echo '' || echo '--host')
.PHONY: run

preview:  ## Preview build
	pnpm run build && pnpm run preview $$([ -z "$$CONTAINER" ] && echo '' || echo '--host')
.PHONY: preview


# =============================================================================
# CI
# =============================================================================
ci: generate lint scan test benchmark e2e-test build  ## Run CI tasks
.PHONY: ci

generate:  ## Generate stubs
	pnpm exec svelte-kit sync
.PHONY: generate

format:  ## Run autoformatters
	pnpm exec prettier --list-different --write .
	pnpm exec eslint --fix .
.PHONY: format

lint: generate  ## Run linters
	pnpm exec prettier --check .
	pnpm exec eslint .
	pnpm exec tsc --noEmit
.PHONY: lint

scan:  ## Run scans
	checkov --quiet --directory .
.PHONY: scan

test: generate ## Run tests
	pnpm run test
.PHONY: test

benchmark:  ## Run benchmarks

.PHONY: benchmark

e2e-test:  ## Run e2e tests
	pnpm run e2e
.PHONY: e2e-test

build: generate  ## Build application
	pnpm run build
.PHONY: build


# =============================================================================
# Handy Scripts
# =============================================================================
clean:  ## Remove temporary files
	rm -rf build/ coverage/ playwright-report/
	find . -path '*.log*' -delete
.PHONY: clean
