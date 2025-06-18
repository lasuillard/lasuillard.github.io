#!/usr/bin/env bash

sudo corepack enable yarn

# Pulumi CLI
curl -fsSL https://get.pulumi.com | sudo sh -s -- --install-root /usr/local

# Some useful tools
pipx install pre-commit
pipx install aws-annoying
