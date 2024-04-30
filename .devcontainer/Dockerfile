ARG BASE_IMAGE=denoland/deno:alpine
FROM $BASE_IMAGE AS base-env

# Confirm our deno is on the path and check the version
RUN deno --version

# Install some dev and QoL tooling
RUN apk add --no-cache --reinstall gcc
RUN apk --no-cache add \
    bash \
    ca-certificates \
    git \
    openssh \
    openssl \
    binutils \
    coreutils \
    dos2unix \
    curl \
    nodejs \
    npm \
    && npm install -g npm \
    && npm install -g release-it

# Trust self-signed certs in the chain for schemastore.azurewebsites.net:443 for intellisense
# Comment this out for non-corporate envs where you might have MitM attacks from IP loss prevention software like Netskope
# @See: https://en.wikipedia.org/wiki/Netskope
# If you need this kind of mitigation at home on personal hardware, someone might be doing a legit MitM attack against you
# @see: https://en.wikipedia.org/wiki/Man-in-the-middle_attack
# Alpine version
RUN openssl s_client -showcerts  -connect schemastore.azurewebsites.net:443 2>&1 < /dev/null |\
  sed -n '/-----BEGIN/,/-----END/p' |\
  csplit - -z -b %02d.crt -f /usr/local/share/ca-certificates/schemastore.azurewebsites.net. '/-----BEGIN CERTIFICATE-----/' '{*}' \
  && chmod 644 /usr/local/share/ca-certificates/*.crt \
  && update-ca-certificates

# Tell node & python to trust the new cert bundles in addition to the built-ins
ENV NODE_EXTRA_CA_CERTS /etc/ssl/certs/ca-certificates.crt
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

# Command history persistence
ENV PROMPT_COMMAND='history -a'
ENV HISTFILE=/command_history/.ash_history

# Run smoke tests in separate build phase
FROM base-env AS smoke-test-env

# Install node dev dependencies and whatnot
ENV NODE_ENV development

# Smoke test to make sure deno, node, and npm are all still working in the container
RUN mkdir -p /workspaces/deno-playground-smoke
WORKDIR /workspaces/deno-playground-smoke
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test

FROM base-env AS workspace-env
RUN echo NODE_ENV:$NODE_ENV
RUN deno --version && echo 'node version:' $(node --version) && echo 'npm version:' $(npm --version)
