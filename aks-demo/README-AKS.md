# Azure Kubernetes Services Deployment

This document describes just the differences between a local Kubernetes deployment and an Azure Kubernetes Services deployment.  First make sure to read the README.md file at the root of this project before making the changes listed here.

## Azure Specific Steps

1) Create the AKS cluster using Azure Portal or ARM template
2) Install Azure CLI locally
3) Login

```
az login
az account set --subscription <your subscription ID here>
az aks get-credentials --resource-group <your resource group here> --name <your AKS name here>
```

4) Install [helm](https://helm.sh/docs/intro/install/) locally then use it to install an nginx Kubernetes ingress gateway.

```
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
```

5) Go to a folder containing your-certificate.key and your-certificate.crt, and add them to Kubernetes as a secret.  If public DNS is not configured for these names already, optionally add them to your local `hosts` file.

```
kubectl create secret tls company-cert --key <your-certificate.key filename> --cert <your-certificate.crt filename>
```

6) Install [kubectx](https://github.com/ahmetb/kubectx) if you want to easily switch between your local context (cluster) and your AKS or other contexts.

7) Make sure to set a valid Azure Service Bus connection string in `dapr-pubsub-contacts.yaml` or if not using dapr, remove its annotations from `contacts-api.yaml` and make sure it is not selected for the `QueueType` environment variable.

## Differences between AKS and local Kubernetes Deployments

* If you are building containers on an ARM platform like MacOS rather than AMD64, you have to rebuild the containers forcing arm64.
  * In Dockerfile `FROM`, force AMD 64 containers even if building from ARM of other platform.
  * If building from Windows, Azure DevOps, or GitHub, arm64 should already be the default.
  
```yaml
FROM --platform=linux/amd64
```

* Change the StorageClass (example below uses Azure Disk, but Azure File is also supported).

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
    name: aks-sc
provisioner: kubernetes.io/azure-disk
reclaimPolicy: Retain
parameters:
    storageaccounttype: Premium_LRS
    kind: Managed
allowVolumeExpansion: true
```

* If using Azure Disk, a PersistentVolumeClaim can directly reference the storageClassName and not require a separate PersistentVolume.
  * In this demo, only the database (`database-pvc.yaml`) uses a persistent volume.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: database-pvc
spec:
    storageClassName: aks-sc
    accessModes:
    - ReadWriteOnce
    resources:
    requests:
        storage: 1Gi
```

* Services must have an annotation for the resource group name so they know where to look for the public IP
  * For this demo, services are named *-service.yaml, and all need to be edited to match your ersource group name

```yaml
service.beta.kubernetes.io/azure-load-balancer-resource-group: MC_AKS_testing_westus
```

* Any service that is publicly exposed needs to first have an Azure Public IP created, then have that IP referenced as the loadBalancerIP.
  * For this demo, the database and queue services have public IPs and their files need to be updated to reflect your public IP addresses.
  * If AKS was configured with "standard" load balancing, then the public IP must be "standard".  If AKS was configured with "basic" load balancing, then the public IP must be "basic".

```yaml
apiVersion: v1
kind: Service
metadata:
    name: database-service
    annotations:
    service.beta.kubernetes.io/azure-load-balancer-resource-group: MC_AKS_testing_westus  
spec:
    externalTrafficPolicy: Cluster
    loadBalancerIP: 20.47.116.139
    ports:
    - protocol: TCP
    port: 27017
    targetPort: 27017
    selector:
    app: database
    type: LoadBalancer
```

* Azure installs a metrics-server when AKS is built where local Kubernetes requires manual installation