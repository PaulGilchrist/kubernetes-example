# [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster](https://docs.microsoft.com/en-us/azure/aks/csi-secrets-store-driver)

1. Set subscription and add CSI driver

```bash
az account set --subscription 6fddc491-7042-42fb-9cba-e956e9f79e6e

az aks enable-addons --addons azure-keyvault-secrets-provider --name testing --resource-group aks

kubectl get pods -n kube-system -l 'app in (secrets-store-csi-driver, secrets-store-provider-azure)'
```

2. Create an Azure Key Vault named `testing-aks-kv`

3. Add a secret to the key vault

```bash
az keyvault secret set --vault-name testing-aks-kv -n ExampleSecret --value MyAKSExampleSecret
```
4. Get cluster user-assigned managed identity

```bash
az aks show -g aks -n testing --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv
```

5. Set key vault access policies replacing the GUID below with the one returned in step 4 above

```bash
# set policy to read keys in key vault
az keyvault set-policy -n testing-aks-kv --key-permissions get --spn ca87d883-039d-402a-9fc9-71fb65aa035d
# set policy to read secrets in key vault
az keyvault set-policy -n testing-aks-kv --secret-permissions get --spn ca87d883-039d-402a-9fc9-71fb65aa035d
# set policy to read certs in key vault
az keyvault set-policy -n testing-aks-kv --certificate-permissions get --spn ca87d883-039d-402a-9fc9-71fb65aa035d
```

6. Edit the YAML with your tenantId, keyvaultName, userAssignedIdentityID and objects then apply the SecretProviderClass and busybox test pod to the cluster

```bash
kubectl apply -f aks-keyvault/keyvault-spc.yaml
kubectl apply -f aks-keyvault/busybox-pod.yaml
```

7. Test 

```bash
# show secrets held in secrets-store mounted volume (each appears as its own file)
kubectl exec busybox-secrets-store-inline-user-msi -- ls /mnt/secrets-store/

# show environment variables
kubectl exec busybox-secrets-store-inline-user-msi -- env

# print a test secret 'ExampleSecret' held in secrets-store
kubectl exec busybox-secrets-store-inline-user-msi -- cat /mnt/secrets-store/ExampleSecret
```

As values change in Azure key Vault, the file content will change for the volumeMounts, but the environment variables are only set at pod startup.  If environment variables are not used in favor of directly accessing the volumeMounts, then the `env` section of the pod or deployment can be removed.  However, using environment variables is more intuitive and easier for the developer than having to code file access logic into the application.

Step 1 is performed only once for the K8s cluster, but steps 2-7 can be repeated for different key vaults as needed