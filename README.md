# node-playground

A Containerized playground for experimenting with Node.js using [vscode's Remote - Containers](https://code.visualstudio.com/docs/remote/containers) feature.

- [node-playground](#node-playground)
- [Mission Statement](#mission-statement)
- [Using This Guide](#using-this-guide)
- [General Troubleshooting](#general-troubleshooting)
  - [Reloading the Window / Rebuilding the Container](#reloading-the-window--rebuilding-the-container)
  - [Resetting vscode AppData](#resetting-vscode-appdata)
- [Pre-Req Checklist](#pre-req-checklist)
  - [Docker](#docker)
  - [vscode](#vscode)
    - [vscode extensions](#vscode-extensions)
- [Reopen in a Dev Container and Start Hacking](#reopen-in-a-dev-container-and-start-hacking)
  - [Hello, World!](#hello-world)

# Mission Statement

This guide aims to provide a starting Node playground to experiment with Node.js programs in a standardized environment (described by Dockerfile(s)). This guide is written for developers using [vscode's remote container development](https://code.visualstudio.com/docs/remote/containers).

![architecture-containers](https://code.visualstudio.com/assets/docs/remote/containers/architecture-containers.png)

If you're brand new to vscode, you can check out their [series of intro vids to get started](https://code.visualstudio.com/docs/getstarted/introvideos#VSCode).


# Using This Guide
All commands referenced in this document will refer to '.' as the same folder in which this README can be found.

All commands are assumed to be ran under `powershell` for Windows hosts and `bash` for *nix hosts.

# General Troubleshooting
## Reloading the Window / Rebuilding the Container
As of the writing of this doc, vscode remote-containers is still really new. Some of the sharp edges are still there and may require some extra finesse. As a general rule of thumb, if something isn't loading in the remote environment, try to [reload window](./img/reload_window.png) or [rebuilding the container](./img/rebuild_container.png).

- ![](./img/reload_window.png)
- ![](./img/rebuild_container.png)

## Resetting vscode AppData
If your workspace becomes corrupted, opens to a blank screen, or has other issues that can't be mitigated through the gui, your local vscode settings can be inspected / reset at the following locations on your machine:

```yaml
# Mainline
Windows: "~/AppData/Roaming/Code"
Linux: "$HOME/.config/Code/"
macOS: "$HOME/Library/Application Support/Code"

# Insiders
Windows: "~/AppData/Roaming/Code - Insiders"
Linux: "$HOME/.config/Code - Insiders/"
macOS: "$HOME/Library/Application Support/Code - Insiders"
```

# Pre-Req Checklist
## Docker
- [Docker Desktop running locally](https://www.docker.com/products/docker-desktop)
- You must have local volume mounts working to get the most our of this guide. You can test you local drive mounting with the following code:

```powershell
# This should print the contents of your host OS home folder. 
docker run --rm -v ~:/data alpine ls /data
```

## vscode
- [vscode](https://code.visualstudio.com/download) or [vscode insiders](https://code.visualstudio.com/insiders/) if you're a cool kid.
  - You will need v1.38+ to use the `Remote - Containers` feature.
  - As of 2019-09-18, I'd recommend using [Insiders](https://code.visualstudio.com/insiders/) as these features are still in Preview and Insiders gets bug fixes sooner.


### vscode extensions
*Note, if you open the root folder of this project in vscode, you should get a prompt to install the recommended extensions.*

- ![show_recommendations](./img/show_recommendations.png)
- ![recommended](./img/recommended.png)

- Required
  - [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- Recommended
  - For the full list of recommended extensions, checkout the [extensions.json](.vscode/extensions.json) file included in this repository.




# Reopen in a Dev Container and Start Hacking
Open this folder in vscode configured with the pre-recs above and you should be prompted to reopen in Container. From there the .devcontainer config will be used to create and start your dev environment.

- ![popup_reopen_in_container](./img/popup_reopen_in_container.png)

## Hello, World!
To try our your new env, you can start by running the supplied ["Hello, World!" app](index.js) via npm start!

![npm_start](img/npm_start.png)
