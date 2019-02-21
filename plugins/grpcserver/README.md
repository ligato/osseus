# GRPC Server

## TODO

### Finished

- [x] Compile proto file to useable go class
  - (command): protoc -I=. service.proto --go_out=plugins=grpc:.
- [x] Create Dockerfile for **only** backend  
- [x] Allow server to register pb service & fire up server

### In-Progress
- [ ] Create go tests (optional right now)
- [ ] Define CRUD handlers