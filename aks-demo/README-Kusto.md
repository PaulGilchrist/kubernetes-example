# Azure Kubernetes Services Specific Kusto Queries

Examples of useful Kusto queries used for an AKS cluster

```sql
KubeServices
| where Namespace == 'demo'
| distinct ServiceName
| order by ServiceName asc
```

## Get Container ID from image name
```sql
ContainerInventory
| where Image == 'mongodb-api'
| project ContainerID
| distinct ContainerID
```

## Get container Log from container ID
```sql
ContainerLog
| where ContainerID == 'f75bcebb82daa3581ab58853b45d6500d428c1bd1f671ef4cabe294c89db0fc5'
| project TimeGenerated, LogEntry
| order by TimeGenerated desc
```