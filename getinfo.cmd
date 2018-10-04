@echo off
cls
echo.
echo.
kubectl describe deployment angular-deployment
echo.
echo.
kubectl describe deployment ballistics-deployment
echo.
echo.
kubectl describe deployment eve-missions-deployment
echo.
echo.
kubectl get pods
echo.
echo.
kubectl get services
echo.
echo.
kubectl get deployments
echo.
echo.
kubectl get nodes
echo.
echo.
kubectl version
