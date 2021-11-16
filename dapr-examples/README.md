# DAPR Testing

## Dapr CLI Setup

Follow the steps to install DAPR locally using the URL https://docs.dapr.io/getting-started/install-dapr-cli/

You can directly connect to the Redis statestore container at any time using the following command:

```
brew install dapr/tap/dapr-cli
dapr init
dapr --version
```

Dapr configuration will be located at `$HOME/.dapr`.  The default configuration only enables a Redis statestore and Redis pubsub.  If your local development requires different capabilities or backend services, modify the dapr configuration before proceeding to local development.  The abstraction capabilities of Dapr does allow for developing with one service (ex: pubsub.redis) and deploying to another (ex: pubsub.rabbitmq)

Optionally you can connect to Redis to view or update any data

```
docker exec -it dapr_redis redis-cli
```

## Local Development using Dapr

When developing locally, make sure to first run a Dapr sidecar that is accessable through localhost on port 3500

```
dapr run --app-id myapp --dapr-http-port 3500
```

## Kubernetes Setup

Follow the steps to install DAPR to Kubernetes using the URL https://github.com/dapr/quickstarts/tree/v1.4.0/hello-kubernetes

```
dapr init --kubernetes --wait
dapr status -k
```

## Dapr Dashboard

You can expose the Dapr dashboard to the URL http://localhost:9999/ using the following command:

```
dapr dashboard -k -p 9999
```

## Zepkin (Observability) Deshboard

You can view the Zepkin dashboard at http://127.0.0.1:9411/