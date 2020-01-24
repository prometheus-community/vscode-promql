[![Build Status](https://cloud.drone.io/api/badges/slrtbtfs/vscode-prometheus/status.svg)](https://cloud.drone.io/slrtbtfs/vscode-prometheus)

# vscode-prometheus

Prometheus Extension for VS Code based on the [PromQL Language Server](https://github.com/slrtbtfs/promql-lsp).

**Warning: This software is still in an alpha state. Expect all kinds of weird bugs to happen. If you find some, feel free to report them at <https://github.com/slrtbtfs/promql-lsp/issues>**


## Trying out the extension

1. First make sure to have `npm` and the latest version of`go` installed.
2. Install the latest version of the [PromQL Language Server](https://github.com/slrtbtfs/promql-lsp)
```
    GO111MODULE=on go get -u github.com/slrtbtfs/promql-lsp/cmd/...
```
3. Clone this repository
4. Open the cloned folder in VS Code
5. Run
```
    make
```
6. If you want to get metadata from a prometheus server, adjust the `prometheus_url` setting in `promql-lsp.yaml` accordingly.
7. _(Optional, to visualize the communication between language server and client)_  Install the `lsp-inspector-webview extension` in vscode and launch it using `Ctrl+Shift+P -> LSP Inpector: Start LSP Inspector`
8. Press `F5` or click `Debug -> Start Debugging`.
9. A new VS Code window opens which has the extension enabled. If you need some YAML and PromQL files for testing, you can find them in `src/test/suite/testfiles/promql`. To avoid that the files there open in the old editor window, it is necessary to first open the aforementioned folder in the new window with the extension running.
10. If strange things happen, the debug logs displayed in the first VS Code Window might be helpful
