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
| where ContainerID == '46140e20dec6f193423f3cd65deda90710ae9e5741a94f92a45e10a960328c15'
| project TimeGenerated, LogEntry
| order by TimeGenerated desc
```