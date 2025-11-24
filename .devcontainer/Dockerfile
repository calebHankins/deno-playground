ARG BASE_IMAGE=denoland/deno
FROM $BASE_IMAGE AS base-env

# Confirm our deno is on the path and check the version
RUN deno --version

# Persist command history through container rebuilds
# Make this idempotent, system-wide, and compatible with Debian/bourne shells.
RUN mkdir -p /command_history \
  && touch /command_history/.bash_history \
  && chown -R 1000:1000 /command_history \
  && chmod 0755 /command_history \
  && chmod 0644 /command_history/.bash_history \
  && cat >/etc/profile.d/command_history.sh <<'BASH'
#!/usr/bin/env bash
# Persist shell history across container sessions
# Store shared history in a Docker volume mounted at /command_history
shopt -s histappend 2>/dev/null || true
export HISTFILE=/command_history/.bash_history
export HISTSIZE=5000
export HISTFILESIZE=10000
if [ -n "$PROMPT_COMMAND" ]; then PROMPT_COMMAND="$PROMPT_COMMAND; history -a"; else PROMPT_COMMAND='history -a'; fi
export PROMPT_COMMAND
BASH
RUN chmod 0644 /etc/profile.d/command_history.sh \
  && grep -qxF 'if [ -f /etc/profile.d/command_history.sh ]; then . /etc/profile.d/command_history.sh; fi' /etc/bash.bashrc || echo 'if [ -f /etc/profile.d/command_history.sh ]; then . /etc/profile.d/command_history.sh; fi' >> /etc/bash.bashrc

# Install some dev and QoL tooling
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    bash \
    ca-certificates \
    git \
    openssh-client \
    openssl \
    binutils \
    coreutils \
    dos2unix \
    curl \
    sed \
    nodejs \
    npm \
    bsdmainutils \
  && npm install -g npm \
  && npm install -g release-it \
  && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI (gh)
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
  && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends gh \
  && rm -rf /var/lib/apt/lists/* \
  || true

# WARN mitigation: detect npm startup WARNING about deprecated builtin config
# and remove that key from the builtin npmrc only when necessary.
# This is done in its own RUN step so the image build logs clearly show
# whether the mitigation ran or not and makes it easier to debug failures.
RUN set -eux; \
  echo "Checking for npm WARN about deprecated builtin 'globalignorefile'..."; \
  npm_output=$(npm config list -l 2>&1 || true); \
  if echo "$npm_output" | grep -q 'Unknown builtin config "globalignorefile"\|Unknown builtin config \'globalignorefile\''; then \
    echo "Detected deprecated 'globalignorefile' warning; cleaning builtin npmrc"; \
    npmrc_path=$(node -e "console.log(require.resolve('npm/package.json').replace('/package.json','/npmrc'))"); \
    if [ -f "$npmrc_path" ]; then \
      echo "Removing '^globalignorefile=' from: $npmrc_path"; \
      sed -i '/^globalignorefile=/d' "$npmrc_path" || true; \
    else \
      echo "npm builtin npmrc not found at: $npmrc_path"; \
    fi; \
  else \
    echo "No 'globalignorefile' warning detected; nothing to do."; \
  fi

# Trust self-signed certs in the chain for schemastore.azurewebsites.net:443 for intellisense
# Comment this out for non-corporate envs where you might have MitM attacks from IP loss prevention software like Netskope
# @See: https://en.wikipedia.org/wiki/Netskope
# If you need this kind of mitigation at home on personal hardware, someone might be doing a legit MitM attack against you
# @see: https://en.wikipedia.org/wiki/Man-in-the-middle_attack
# Debian version
RUN openssl s_client -showcerts  -connect schemastore.azurewebsites.net:443 2>&1 < /dev/null |\
 sed -n '/-----BEGIN/,/-----END/p' >\
 /usr/local/share/ca-certificates/schemastore.azurewebsites.net.crt \
 && chmod 644 /usr/local/share/ca-certificates/*.crt \
 && update-ca-certificates --verbose

# Tell node & python to trust the new cert bundles in addition to the built-ins
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/schemastore.azurewebsites.net.crt
ENV REQUESTS_CA_BUNDLE=/usr/local/share/ca-certificates/ca-certificates.crt

# Run smoke tests in separate build phase
FROM base-env AS smoke-test-env

# Install node dev dependencies and whatnot
ENV NODE_ENV=development

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
RUN mkdir -p /root/.config/gh && chmod 0700 /root/.config/gh || true
