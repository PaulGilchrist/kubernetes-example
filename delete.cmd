@echo off
kubectl delete service angular-service
kubectl delete deployment angular-deployment
kubectl delete service ballistics-service
kubectl delete deployment ballistics-deployment
kubectl delete service eve-missions-service
kubectl delete deployment eve-missions-deployment
