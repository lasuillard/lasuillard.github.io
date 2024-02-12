#!/usr/bin/env bash

hooks_dir='./.devcontainer/postAttachCommand'

git config --global --add safe.directory '*'
git fetch --all

make init
