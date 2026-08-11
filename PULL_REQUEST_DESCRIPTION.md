# Pull request: ci: remove global npm upgrade from devcontainer Dockerfile

This PR removes the `npm install -g npm` step from the .devcontainer/Dockerfile which causes the Docker image build to fail with `npm ERR! notsup` on the runner environment. The distro-provided npm is sufficient for installing `release-it` and running project tasks.

- Removes global npm upgrade step, keeps `npm install -g release-it`.
- Keeps other Dockerfile logic unchanged.
