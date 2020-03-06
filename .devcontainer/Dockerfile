FROM node:current-alpine

# Install some dev and QoL tooling
RUN apk --no-cache add \
    bash \
    ca-certificates \
    git \
    openssh

# Command history persistence
ENV PROMPT_COMMAND='history -a'
ENV HISTFILE=/command_history/.ash_history

# Install node dev dependencies and whatnot
ENV NODE_ENV development
