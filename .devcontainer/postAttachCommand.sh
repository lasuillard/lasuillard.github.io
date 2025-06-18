#!/usr/bin/env bash

make install

sudo chown --recursive "$(id --user):$(id --group)" ~
sudo chmod --recursive 600 ~/.pulumi/passphrase ~/.aws
sudo chmod --recursive u=rwX,g=,o= ~/.pulumi ~/.aws
