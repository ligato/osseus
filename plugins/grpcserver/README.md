# GRPC Server

## Reference

- [keyval](https://godoc.org/github.com/ligato/cn-infra/db/keyval)
- [agent](https://godoc.org/github.com/ligato/cn-infra/agent)
- [etcd](https://godoc.org/github.com/ligato/cn-infra/db/keyval/etcd)
- [grpc](https://godoc.org/github.com/ligato/cn-infra/rpc/grpc)
- [kvproto](https://godoc.org/github.com/ligato/cn-infra/db/keyval/kvproto)
- [proto](https://developers.google.com/protocol-buffers/docs/gotutorial)
- [simple server](https://grpc.io/docs/tutorials/basic/go.html)

## Sequence Flow (my understanding currently)

_REST API (CLIENT)_ --> _GRPC SERVER_ --> _DEFINE LINK TO ETCD W/ BROKER_ --> _ETCD_

- for grpc server, I should be defining a .proto file, a makefile to generate sources & run the build, and server file (grpc.go) to interact with the generated proto file functions
- still unsure if we need watcher at all, leaning towards no

## TODO

### **Finished**

- [x] Compile proto file to useable go class
  - (command): protoc -I=. service.proto --go_out=plugins=grpc:.
- [x] Create Dockerfile for **only** backend  

### **In-progress**
- [ ] Create go tests (optional right now)
- [ ] Allow server to register pb service & fire up server
- [ ] Create CRUD endpoints 
- [ ] Connect to etcd using Broker API

## Backend Installation

```bash
# After git cloning the repo, start the backend
# Build the backend docker image
docker build --force-rm=true -t dev/osseus --build-arg AGENT_COMMIT=2c2b0df32201c9bc814a167e0318329c78165b5c --no-cache -f docker/server/Dockerfile .

# After the build, run docker image and ssh into it
docker run -it --name agent --privileged dev/osseus bash

# If you make changes & exit out, you can restart it
docker start agent
docker exec -it agent
```
