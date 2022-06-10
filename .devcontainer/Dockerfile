ARG BASE_IMAGE=denoland/deno:alpine
FROM $BASE_IMAGE

# Confirm our deno is on the path and check the version
RUN deno --version

# Install some dev and QoL tooling
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
    && npm install --location=global npm \
    && npm install --location=global release-it

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

# Install node dev dependencies and whatnot
ENV NODE_ENV development
