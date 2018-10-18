# Docker and Kubernetes Setup Demo

1. Windows key then type ```Windows Features```
    * Add ```Hyper-V``` and ```Containers```
2. Google - Download Docker - [Link](https://docs.docker.com/docker-for-windows/install/)
3. Show Docker on Taskbar
    * Show Linux or Windows
4. Show enabling Kubernetes in Settings
5. Show ```node-web-server``` project's Dockerfile
    * Discuss ```FROM``` how it builds from a base container
    * Google - Docker Hub - [Link](https://hub.docker.com/)
      * Search for ```Microsoft```
    * Discuss ```RUN```, ```COPY```, ```WORKDIR```
6. Discuss Docker commands ```build```, ```run```, ```images```, ```ps```, ```push```
    * Discuss pushing up container to repository (either ```Docker Hub``` or ```Azure Container Registry```)
7. Show ```angular-template``` project's Dockerfile
    * Discuss how it builds from ```node-web-server``` allowing nesting of containers
    * Discuss how ```dist``` folder is being copied into container
    * Discuss ```EXPOSE```
    * Discuss ```CMD``` and how it differs from ```RUN```
8. Show ```angular-template``` project's ```yaml``` deployment file
    * Discuss terms ```pod```, ```deployment```, ```service```
      * Discuss multiple containers in a pod, and multiple pods in a ```yaml``` file
    * Discuss ```LoadBalancer``` a type of service
    * Discuss ```replicas```
    * Discuss ```labels``` and ```selectors```
    * Discuss ```port``` vs ```targetPort```
    * Discuss ```livenessProbe``` types TCP, HTML, etc.
      * Discuss live add and remove of containers based on health
9. Discuss creating and live updating Kubernetes pods
10. Run create process - See README.md
11. Get info - See README.md
    * Discuss ```desired``` vs ```current```
12. Do live update
13. Use browser to show all sites up and running on different ports
14. Mention containers run on...
    * Azure App Service
    * Azure Service Fabric
    * Azure Container Instances
    * Azure Container Service
    * Azure Kubernetes Service (AKS)
    * Azure Container Registry