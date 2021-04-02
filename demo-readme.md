# Docker and Kubernetes Setup Demo

1. Start with all Kubernetes setting removed

```
kubectl delete service mongodb-api-service
kubectl delete statefulSet mongodb-api0
kubectl delete service mongodb0-service
kubectl delete statefulSet mongodb0
kubectl delete persistentVolumeClaim mongodb0-pvc
kubectl delete persistentVolume mongodb0-pv
kubectl delete storageclass local-sc
```

2. Run single command to setup full environment

```
kubectl apply -f mongodb.yaml
```

3. Run MongoDB Compass and show direct access to database

4. Run Postman and show direct access to API

5. Run Browser and show direct access to webiste
