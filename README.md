# Kubernetes / Docker Example

This example was put together using Docker for Windows and it’s built in Kubernetes support.  This example shows how the YAML configuration file is assembled, allowing for multiple simultaneous containers, combined into pods, which are then scaled independently and exposed through load balancers.  Each load balancer also monitors the health of its underlying containers using tcpSocket monitoring, but could also be done using http requests or command tests.

See [Configure Liveness and Readiness Probes]( https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)

This configuration is not restricted to Docker for Windows or its built in Kubernetes engine, and should work equally well on Azure, AWS, Google or any Kubernetes compliant cloud of on-premises environment.

## Create

```cmd
kubectl create -f kube-deployment.yaml
```

## Update (live)

```cmd
kubectl apply -f kube-deployment.yaml
```

## Delete

```cmd
kubectl delete service angular-service
kubectl delete deployment angular-deployment
kubectl delete service ballistics-service
kubectl delete deployment ballistics-deployment
kubectl delete service eve-missions-service
kubectl delete deployment eve-missions-deployment
```

## Get Information at each level (high to low)

```cmd
kubectl version
kubectl get nodes
kubectl get deployments
kubectl get services
kubectl get pods
kubectl describe deployment angular-deployment
kubectl describe deployment ballistics-deployment
kubectl describe deployment eve-missions-deployment
```