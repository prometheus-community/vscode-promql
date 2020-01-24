# vscode-prometheus

Prometheus Extension for VS Code based on the [PromQL Language Server](https://github.com/slrtbtfs/promql-lsp).

**Warning: This software is still in an alpha state. Expect all kinds of weird bugs to happen. If you find some, feel free to report them at <https://github.com/slrtbtfs/promql-lsp/issues>**


## Trying out the extension

1. First make sure to have the latest version of`go` installed.
2. Install the latest version of the [PromQL Language Server](https://github.com/slrtbtfs/promql-lsp)
```
    GO111MODULE=on go get -u github.com/slrtbtfs/promql-lsp/cmd/...
```
3. Download the latest release binary from the releases page and install it with 
```
code --install-extension vscode-prometheus-0.1.0.vsix
```
4. Restart VS Code
5. If you want to get metadata from a Prometheus server, set the `prometheus.url` setting in VS Code to the URL of the desired Prometheus.:

If you don't trust the release binary you can of course also build it yourself using the Makefile.