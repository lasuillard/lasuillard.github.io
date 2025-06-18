#!/usr/bin/env bash

sudo corepack enable yarn

# pre-commit
pipx install pre-commit

# Install Sentry CLI
curl -sL https://sentry.io/get-cli/ | sh

# Pulumi CLI
curl -fsSL https://get.pulumi.com | sh
