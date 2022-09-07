# Helm chart for local installation

Helm chart for installing this example project to a `MacOS` local Kubernetes cluster

Test helm chart without installing anything
```
helm install demo helm-chart -n demo --set global.env=local --dry-run --debug
```

Install helm chart.  You can choose between "local" (MacOS) and "dev" (Azure Kubernetes Services) environments
```
helm install demo helm-chart -n demo --set global.env=local
```

Check on the status of the deployment.  You can also use any `kubectl` commands
```
helm status demo -n demo
```

Uninstall
```
helm uninstall demo
```