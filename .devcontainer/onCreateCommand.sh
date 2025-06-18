#!/usr/bin/env bash

sudo corepack enable yarn

# pre-commit
pipx install pre-commit

# Pulumi CLI
curl -fsSL https://get.pulumi.com | sudo sh -s -- --install-root /usr/local
