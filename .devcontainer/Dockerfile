ARG BASE_IMAGE=node:current-alpine
FROM $BASE_IMAGE

# Install some dev and QoL tooling
RUN apk --no-cache add \
    bash \
    ca-certificates \
    git \
    openssh \
    && npm install -g release-it

# Command history persistence
ENV PROMPT_COMMAND='history -a'
ENV HISTFILE=/command_history/.ash_history

# Install node dev dependencies and whatnot
ENV NODE_ENV development

# Install deno
# https://github.com/denoland/deno_install
RUN apk --no-cache add curl
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
