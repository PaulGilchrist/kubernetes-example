# Kubernetes Setup

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

## Appendix

### Optional troubleshooting commands

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
kubectl delete service mongodb-api-service
kubectl delete statefulSet mongodb-api0
kubectl delete service mongodb0-service
kubectl delete statefulSet mongodb0
kubectl delete persistentVolumeClaim mongodb0-pvc
kubectl delete persistentVolume mongodb0-pv
kubectl delete storageclass local-sc
```
