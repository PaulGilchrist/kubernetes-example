# Helm chart for local installation

Helm chart for installing this example project to a `MacOS` local Kubernetes cluster

helm install demo helm-chart -n demo --dry-run --debug
helm install demo helm-chart -n demo
helm status demo -n demo