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

1) Create a folder named `mongodb` located at `/Users/Shared`.  This folder can be moved to any other root folder, as long as the file named `full-demo.yaml` has its `spec.local.path` changed accordingly.

2) Add `contacts.company.com` and `products.company.com `to your local `/private/etc/hosts` file pointing them to `127.0.0.1`
   * This will allow the ingress controller to route specific DNS names to specific services
   * URL path routing is also supported but not demonstrated here

3) Install Kubernetes ingress controller before running this script (see https://github.com/kubernetes/ingress-nginx/) for latest version

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/cloud/deploy.yaml
```
4) If using SSL/TLS for ingress, execute the steps in file `certificate-creation/README.md`

5) Apply the templates needed to setup the pod.  It may take a minute or two to complete the build if the container images are not already local

```
kubectl apply -f full-demo.yaml
```

   * There is a job that runs to populate the database, the container will remain for log viewing, and should later be removed manaully.  You should wait for this job to complete before proceeding to the remaining steps.

6) You can now connect to the database any client like `MongoDB Compass` and the connection string of [mongodb://localhost:27017]()

7) You can now connect to the API using the following URLs and any browser or API tool such as `Postman`.  The database will initially be empty, so you may want to start by POSTing a new contact record

```
https://contacts.company.com/
https://contacts.company.com/swagger
https://contacts.company.com/$metadata
https://contacts.company.com/$metadata#contacts
```
   * You can similarly connect to the same 4 paths on the https://products.company.com/ API

8) You can connect to both API Open API through the `service registry` at http://localhost:8081

9) If you have NodeJS installed, you can monitor the `event message queue` by running the following command:

```
node receive-api.js
```

9) You can connect to both demo `application's website` that at http://localhost:8080


# Appendix

## Kubernetes Dashboard

Reference - https://github.com/kubernetes/dashboard

1) Install dashboard into K8s

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.0/aio/deploy/recommended.yaml
```

2) Create dashboard admin user
```
kubectl apply -f dashboard-adminuser.yaml
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

## Complete Removal
```
kubectl delete -f full-demo.yaml
```

## Container Update Example (or job re-run)

```
kubectl delete job test-data-management
kubectl apply -f full-demo.yaml    
```