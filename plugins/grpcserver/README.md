# GRPC Server

## TODO

### Finished

- [x] Compile proto file to useable go class
  - (command): protoc -I=. service.proto --go_out=plugins=grpc:.
- [x] Create Dockerfile for **only** backend  
- [x] Allow server to register pb service & fire up server
- [x] Define CRUD handlers

### In-Progress
- [ ] Create go tests (optional right now)
- [ ] Create grpc client to test functionality