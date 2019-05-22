---
title: "Understanding how to run the application using Kubernetes"
---

# :zap: Getting Started: Kubernetes

This document describes how the development Docker images can be deployed on a single-node development Kubernetes (k8s) cluster using MicroK8s on Linux. Each component of our application has a service and uses host networking to be available through localhost. We use an initContainer to check that Etcd is running properly before running our Agent to ensure no connection errors.

## First, clone the repo:
```
git clone https://github.com/ligato/osseus
cd /osseus
```

## Install Microk8s (Linux)
```bash 
sudo snap install microk8s --classic --channel=1.13/stable

# Check everything is configured
microk8s.status
```

## Start & run Osseus in a cluster
```bash
# Start cluster
microk8s.start

# Check cluster info
microk8s.kubectl cluster-info

# Run Osseus
microk8s.kubectl apply -f osseus.yaml

# Open a browser to view the application
http://localhost:3000
```