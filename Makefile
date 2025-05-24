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
install:  ## Install deps and tools
	yarn install
	yarn run playwright install --with-deps
	pre-commit install --install-hooks
.PHONY: install

update:  ## Update deps and tools
	yarn upgrade
	pre-commit autoupdate
.PHONY: update

run:  ## Run development application
	yarn run dev $$([ -z "$$CONTAINER" ] && echo '' || echo '--host')
.PHONY: run

preview:  ## Preview build
	yarn run build
	yarn run preview --ip "$$([ -z "$$CONTAINER" ] && echo '0.0.0.0' || echo '127.0.0.1')"
.PHONY: preview


# =============================================================================
# CI
# =============================================================================
ci: generate lint test e2e-test  ## Run CI tasks
.PHONY: ci

generate:  ## Generate stubs
	yarn run svelte-kit sync
.PHONY: generate

format:  ## Run autoformatters
	yarn run prettier --list-different --write .
	yarn run eslint --fix .
.PHONY: format

lint: generate  ## Run linters
	yarn run prettier --check .
	yarn run eslint .
	yarn run tsc --noEmit
.PHONY: lint

test: generate ## Run tests
	yarn run test
.PHONY: test

e2e-test:  ## Run e2e tests
	yarn run build
	yarn run e2e
.PHONY: e2e-test

build: generate  ## Build application
	yarn run build
.PHONY: build


# =============================================================================
# Handy Scripts
# =============================================================================
clean:  ## Remove temporary files
	rm -rf build/ coverage/ playwright-report/
	find . -path '*.log*' -delete
.PHONY: clean
