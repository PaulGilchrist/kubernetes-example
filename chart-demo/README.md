# Helm chart for local installation

Helm chart for installing this example project to a `MacOS` local Kubernetes cluster

helm install my-demo chart-demo -n demo --dry-run --debug
helm install my-demo chart-demo -n demo
helm status my-demo -n demo