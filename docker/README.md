---
title: "Understanding how to run the application using Docker"
---

# :zap: Getting Started: Docker

This document describes how our application components can be put into a container and deployed with Docker. Only the agent and client images need to be containerized, as Etcd is pulled from Dockerhub, where we only specify what version is needed. 

## First, clone the repo:
```
git clone https://github.com/ligato/osseus
cd /osseus
```
## Build the client & agent images:

```bash
# Build client
docker build --force-rm=true -t client --no-cache -f docker/ui/Dockerfile .

# Build agent
docker build --force-rm=true -t agent --build-arg AGENT_COMMIT=2c2b0df32201c9bc814a167e0318329c78165b5c \ 
    --no-cache -f docker/agent/Dockerfile .
```

## Build and run Etcd **before** running the agent container:

```bash
sudo docker run -p 12379:12379 --name etcd --rm \ 
    quay.io/coreos/etcd:v3.3.8 /usr/local/bin/etcd \ 
    -advertise-client-urls http://0.0.0.0:12379 \ 
    -listen-client-urls http://0.0.0.0:12379
```

## Lastly, run the client and agent containers:

```bash
# Run agent
docker run -p 9191:9191 agent

# Run client
docker run client
```

**NOTE:**
To test everything is working properly, first make sure that there are no errors in any of the build processes or when the containers start up. Then, go to the local network endpoint where the **client** is displayed, choose some plugins & click "Generate". You'll then see the Agent go through transactions and can double check that the k-v pairs were stored successfully in etcd by running ```etcdctl get --from-key ''``` in a separate terminal.