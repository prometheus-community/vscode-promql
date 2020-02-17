[![Build Status](https://raster.shields.io/drone/build/slrtbtfs/vscode-prometheus.png)](https://cloud.drone.io/slrtbtfs/vscode-prometheus)

# vscode-prometheus

Prometheus Extension for VS Code based on the [PromQL Language Server](https://github.com/slrtbtfs/promql-lsp).


## Trying out the extension
1. Download the latest release binary from the releases page and install it with 
```
code --install-extension vscode-prometheus-<version>.vsix
```
2. Restart VS Code
3. If you want to get metadata from a Prometheus server, go to the `Extensions -> PromQL` section in the VS Code settings and set the URL of the server in the field `Prometheus URL`
4. Open some of the files in `/src/test/testfiles/promql` and try editing them.

If you don't trust the release binary you can of course also build it yourself using the Makefile.
