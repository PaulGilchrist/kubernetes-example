# kubernetes-example
This project shows a multi-tiered application environment being built with a single Kubernetes command.  Kubernetes executes the following sequence of events:

1) Builds a Mongo database server ([mongodb://localhost:27017/](mongodb://localhost:27017/))
2) Creates a new database (`mongotest`) and container (`contacts`), then populates it with synthetic data
3) Creates an Event queue service (http://localhost:15672/)
4) Builds two separate OData API (https://contacts.company.com & https://products.company.com) and connects one of them to both the new database, and new event queue service
   * Make sure to add these to your local `hosts` file pointing them to `127.0.0.1`
5) Builds a website (http://localhost:8080) and connects it to the new contacts OData API
6) Builds a service registry (http://localhost:8081) and connects it to both new OData API 

All of these projects are available on [Github](https://github.com/PaulGilchrist?tab=repositories) and can change from `latest` to specific versions if desiring manual control over when an update occurs.

## Kubernetes Setup

1) Create a folder named `mongodb` located at `/Users/Shared/containerStorage`.  This folder can be moved to any other root folder, as long as the file named `local-demo/database-pv.yaml` has its `spec.local.path` changed accordingly.

2) Add the following lines to your local `/private/etc/hosts`
   * This will allow the ingress controller to route 80/443 traffic to specific DNS names and URL paths to specific services and enforce TLS encryption, while also allowing the queue and database to route using their specific ports

```
127.0.0.1	app.local.com
127.0.0.1	api.local.com
127.0.0.1	queue.local.com
127.0.0.1	dataabse.local.com
```

4) [Install Helm](https://helm.sh/docs/intro/install/) locally then use it to install an nginx Kubernetes ingress gateway. **Sometimes Ingress on Mac local Kubernetes will require both resetting Kubernetes and restarting Docker for it to function properly.**

```
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
```

5) To support SSL/TLS for ingress, execute the steps in file `certificate-creation/README-cert-creation.md` to create a self-signed certificate or the steps in file `certificate-creation/README-pfx-to-crt.md` if you already have a public certificate.

6) Create the namespace
```
kubectl create namespace demo
```

7) Install a [metrics server]([https://github.com/kubernetes-sigs/metrics-server#deployment) by first copying [YAML](https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml) followed by adding `--kubelet-insecure-tls` to the `args` section, changing `--metric-resolution=15s` from 15s to 90s, and then applying the file using `kubectl`.  This step is not required for Azure AKS, and only needed for local Kubernetes.  Try to keep the metric-resolution as low as possible, but if too low, the metrics-server will fail to start.

* Test readiness
```
kubectl describe apiservice v1beta1.metrics.k8s.io
```

* View metrics for nodes or pods
```
kubectl top pod -A
kubectl top node
```


8) Apply the templates needed to setup the pod.  It may take a minute or two to complete the build if the container images are not already local.

```
kubectl apply -f demo
```

9) If using a local Kubernetes cluster apply the local specific files

```
kubectl apply -f demo/local-only
```

10) If using an Azure Kubernetes cluster apply the AKS specific files

```
kubectl apply -f demo/aks-only
```

11) Connect to the database container's console and setup an admin account
```
kubectl exec --namespace demo --stdin --tty database-0 -- /bin/bash

mongo
use admin
db.createUser({
    user: "admin",
    pwd: "mongodb-k8s-demo",
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" },
        { role: "dbAdminAnyDatabase", db: "admin" },
        { role: "clusterAdmin", db: "admin" }
    ],
    mechanisms:[ "SCRAM-SHA-1" ]
})
exit
exit
```

## Testing

There is a job that runs to populate the database, the container will remain for log viewing, and should later be removed manaully.  You should wait for this job to complete before proceeding to the remaining steps.

`Chrome on a Mac will not allow self-signed certificates, and will not allow you to proceed to website without clikcing anywhere on the page and typing "thisisunsafe"`

1) You can now connect to the database using any client like [MongoDB Compass](https://www.mongodb.com/products/compass) and the connection string of [mongodb://database.local.com:27017]()

2) You can connect to the message queue admin console using the URL http://queue.local.com:15672, the username of `guest` and the password of `guest`

3) You can connect to the APIs using the URL https://api.local.com/.
   * This URL will connect to both the contacts and products OpenAPI (swagger) specifications, and allow testing either backend API service.

4) You can connect to the application using the URL https://app.local.com/.

5) If you have NodeJS installed, you can monitor the `event message queue` by running the following command:

```
node receive-api.js
```

# Appendix

## Dapr Setup (optional)

This demo uses RabbitMQ for messaging, MongoDB for state, and native Kubernetes for telemetry and secrets but if wanting to abstract further with Dapr, follow the below steps.

1) [Install HomeBrew](https://mac.install.guide/homebrew/index.html) (if not already installed)

2) Use Homebrew to [install Helm](https://helm.sh/docs/intro/install/) (if not already installed)

3) Use Homebrew to [Install the Dapr CLI](https://docs.dapr.io/getting-started/install-dapr-cli/)

```
arch -arm64 brew install dapr/tap/dapr-cli
```

4) [Setup Dapr on your Kubernetes cluster](https://github.com/dapr/quickstarts/tree/v1.4.0/hello-kubernetes#step-1---setup-dapr-on-your-kubernetes-cluster) including redis cache as both the state and pubsub store, or choose alternatives to redis such as mongoDB, rabbitMQ, or many others.

```
dapr init --kubernetes --wait
dapr status -k
```

5) Add RabbitMQ exchange named "contacts" of type `fanout` and bind it to a new queue also named "contacts"

6) Edit `contacts-api.yaml` environment variable "QueueType" from "RabbitMQ" to "Dapr" and re-apply this yaml file, and make sure the dapr annotations are not commented out

7) Optional - You can expose the Dapr dashboard to the URL http://localhost:9999 using the following command

```
dapr dashboard -k -p 9999
```

## Lens Dashboard (optional)

The Lens Kubernetes IDE can be installed here: [Lens Dekstop](https://k8slens.dev), and you can read more about it here: [Overview](https://docs.k8slens.dev/main/)

If using Lens you can optionally go to `Settings/Lens Metrics` for any managed cluster and enable Prometheus.  Once doing this, you will begin seeing CPU, memory and capacity metrics displayed directly within Lens.  If wanting to also directly access the Prometheus dashboard, you can port forward it to localhost as follows:

```bash
kubectl port-forward --namespace lens-metrics prometheus-0 9090
```

The Prometheus desktop could then be accessed at http://localhost:9090

## Kubernetes Dashboard (optional - Lens Recommended instead)

Although you can use these steps to install the Kubernetes dashboard, it is recommended to use [Lens Dekstop](https://k8slens.dev) instead.

Reference - https://github.com/kubernetes/dashboard

1) Install dashboard into K8s

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.4.0/aio/deploy/recommended.yaml
```

2) Create dashboard admin user
```
kubectl apply -f examples/dashboard-adminuser.yaml
```
3) Get bearer token of dashboard admin user
```
kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```
4) Proxy into Kubernetes cluster to access dashboard
```
kubectl proxy
```

5) Browse to dashboard and enter token
```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

## Removing an Old Cluster From Config

```
kubectl config view
kubectl config unset users.clusterUser_AKS_testing
kubectl config unset contexts.testing
kubectl config unset clusters.testing
```