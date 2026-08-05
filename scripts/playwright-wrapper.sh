#!/usr/bin/env bash

: '
Wrap Playwright CLI with extra functionalities.

- Get a free port for the web server (__WEBSERVER_PORT)

  Playwright launches a web server for the tests. But the tests are run in parallel,
  so if we obtain a free port for the web server in the Playwright config file,
  each test will get a different free port and will not be able to connect to
  the web server.

  So we need to obtain a free port before launching Playwright, and pass it to
  the Playwright config file.

'

free_port="$(node ./scripts/get-free-port.js)"

export __WEBSERVER_PORT="$free_port"

exec playwright "$@"
