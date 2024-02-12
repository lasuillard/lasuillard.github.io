FROM node:20.8.0-bookworm-slim AS workspace

# Workspace image, don't care the user
USER root:root

SHELL ["/bin/bash", "-c"]

# Install dev dependencies & utils
RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    curl \
    git \
    gnupg2 \
    jq \
    make \
    openssh-client \
    pkg-config \
    python3-pip \
    wget \
    xvfb \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Change working directory
ARG WORKSPACE="/workspace"

WORKDIR "${WORKSPACE}"

# Install dev tools
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

# Enable Node package managers
RUN corepack enable && pnpm config set store-dir ~/.local/share/pnpm/store

# Download deps
COPY .npmrc package.json pnpm-lock.yaml ./
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install --frozen-lockfile
RUN pnpm exec playwright install --with-deps

VOLUME ["${WORKSPACE}/node_modules"]

# Remove existing GPG as it interrupts GPG injection by devcontainer
RUN rm -rf ~/.gnupg

RUN git config --system --add safe.directory "${WORKSPACE}"

HEALTHCHECK NONE
