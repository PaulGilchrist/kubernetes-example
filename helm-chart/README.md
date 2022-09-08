# Helm chart for local MacOS or Azure Kubernetes Services (AKS) installation


### Install
1) Test a dry run of the templates against your cluster.  Choose one of the below commands with the first one being designed for a local MacOS install, and the second being designed for an Azure Kubernetes Services install.  If choosing to do the AKS install, first setup an Azure Public IP to be used by the queue service and update the below command with that IP.

```
helm install demo helm-chart -n demo --set global.env=local,global.domain=local.com --dry-run --debug

helm install demo helm-chart -n demo --set global.env=dev,global.domain=company.com,queue.loadBalancerIP=20.47.116.6 --dry-run --debug
```

2) Apply the templates needed to setup the pod by re-running the above command with `--dry-run --debug` removed.

### Status
Check on the status of the deployment.  You can also use any `kubectl` commands
```
helm status demo -n demo
kubectl get all -n demo
kubectl describe pod <podname> -n demo
```

### Upgrade
```
helm uninstall demo -n demo
```

### Uninstall
```
helm uninstall demo -n demo
```