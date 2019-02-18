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

- [ ] Create go tests (optional right now)
- [x] Compile proto file to useable go class
  - (command): protoc -I=. service.proto --go_out=plugins=grpc:.
- [x] Create CRUD endpoints
- [x] Allow server to register pb service & fire up server
- [ ] Create Dockerfile for **only** backend  
- [ ] Connect to etcd using Broker API
