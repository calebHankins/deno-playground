ARG BASE_IMAGE=node:current-alpine
FROM $BASE_IMAGE

# Install some dev and QoL tooling
RUN apk --no-cache add \
    bash \
    ca-certificates \
    git \
    openssh \
    binutils \
    coreutils \
    dos2unix \
    curl \
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

# Install node dev dependencies and whatnot
ENV NODE_ENV development

# Install deno pre-reqs
# Looks like this needs glibc still at the moment
# TODO(https://github.com/denoland/deno/issues/1495)
# TODO This issue is closed, but the post install deno was not executing for me.
# Cheating off this aws-cli on alpine SO post for alpine glibc install
# https://stackoverflow.com/questions/60298619/awscli-version-2-on-alpine-linux
ENV GLIBC_VER=2.31-r0
# RUN apk --no-cache add \ # Installing these earlier for the dev playground
#         binutils \
#         curl \
RUN    curl -sL https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub -o /etc/apk/keys/sgerrand.rsa.pub \
    && curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-${GLIBC_VER}.apk \
    && curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-bin-${GLIBC_VER}.apk \
    && apk add --no-cache \
        glibc-${GLIBC_VER}.apk \
        glibc-bin-${GLIBC_VER}.apk \
    # && apk --no-cache del \ # Going to leave these for the dev playground
    #     binutils \
    #     curl \
    && rm glibc-${GLIBC_VER}.apk \
    && rm glibc-bin-${GLIBC_VER}.apk \
    && rm -rf /var/cache/apk/*

# Install deno
# https://github.com/denoland/deno_install
RUN apk --no-cache add curl
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
# Add deno to the path
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"
