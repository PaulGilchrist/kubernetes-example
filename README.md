# kubernetes-example
This project shows a multi-tiered application environment being built with a single Kubernetes command.  Kubernetes executes the following sequence of events:

1) Builds a Mongo database server
2) Creates a new database and container, then populates it with synthetic data
3) Builds an OData API and connects it to the new database
4) Builds a website and connects it to the new OData API

Changes to any of these projects will automatically update environment.  Can change from `latest` to specific versions if desiring manual control over when an update occurs.

## Kubernetes Setup

1) Create a folder named mongodb located at `/Users/Shared`.  This folder can be moved to any other root folder, as long as the file named mongodb.yaml has its `spec.local.path` changed accordingly.

2) Apply the templates needed to setup the pod.  It may take 30-60 seconds to complete the build if the container image is not already local

```
kubectl apply -f mongodb.yaml
```

3) You can now connect to the database using the following connection string and any client like `MongoDB Compass`

```
mongodb://localhost:27017
```

3) You can now connect to the API using the following URLs and any browser or API tool such as `Postman`.  The database will initially be empty, so you may want to start by POSTing a new contact record

```
http://localhost:8081/odata
http://localhost:8081/odata/$metadata#contacts
http://localhost:8081/odata/contacts
```

There is a job that runs to populate the database, the container will remain for log viewing, and should later be removed manaully

## Appendix

### Optional Troubleshooting Commands

```
kubectl describe pvc
kubectl get pod mongodb-0
kubectl describe pods
kubectl describe pod mongodb-0
kubectl get services
kubectl describe service mongodb-service
kubectl logs -f=true mongodb0-0
command: ["sleep", "infinity"] # used to start container without launching mondod,  then enter container and start manually to observe any errors
```

### Complete Removal Steps
```
kubectl delete service mongodb-web-service
kubectl delete statefulSet mongodb-web
kubectl delete service mongodb-api-service
kubectl delete statefulSet mongodb-api
kubectl delete job mongodb-insert
kubectl delete service mongodb-service
kubectl delete statefulSet mongodb
kubectl delete persistentVolumeClaim mongodb-pvc
kubectl delete persistentVolume mongodb-pv
kubectl delete storageclass local-sc
```

### Container Update Example

```
kubectl delete statefulset mongodb-web
kubectl apply -f mongodb.yaml    
```