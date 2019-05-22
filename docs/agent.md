---
title: "Understanding key parts of the Agent"
---

# :zap: Getting started: Agent

Our Agent, found in the `/cmd/agent/` directory, utilizes [CN-Infra](https://github.com/ligato/cn-infra) to integrate multiple plugins to work in unison. Primarily, we use three core plugins maintained within CN-Infra (Etcd data sync, LogManager, and Orchestrator) which are called directly in agent and help us establish a connection to etcd, log output, and manage our transactions sent. We built two custom plugins, restapi and generator: 

- **restapi** handles sending and receiving requests to store and retrieve from Etcd
- **generator** acts upon a specific key to generate template code for our user, respectively

Protocol buffers and the gogoproto package are used throughout agent for faster delivery, simple type definitions, and smaller size compared to other type definitions such as XML.

## Restapi Overview

Our restapi plugin uses CN-Infra's **rest** library to help build our handlers that communicate with the client. We have standard CRUD operations, using different set prefixes based off whether the user is generating a project. For each handler, we use CN-Infra's **keyval** library to create a broker which can access Etcd and perform certain operations, detailed in keyval's [docs](https://godoc.org/github.com/ligato/cn-infra/db/keyval). The handlers that are defined are listed below and are accessible through port 9191:

```golang
...
// RESTAPI HANDLERS
// save project state
p.HTTPHandlers.RegisterHTTPHandler("/v1/projects", p.SaveProjectHandler, POST)
// load project state for project with name = {id}
p.HTTPHandlers.RegisterHTTPHandler("/v1/projects/{id}", p.LoadProjectHandler, GET)
// delete a project
p.HTTPHandlers.RegisterHTTPHandler("/v1/projects/{id}", p.DeleteProjectHandler, DELETE)
// save project plugins to generate code
p.HTTPHandlers.RegisterHTTPHandler("/v1/templates/{id}", p.GenerateHandler, POST)
// get template structure of generated code
p.HTTPHandlers.RegisterHTTPHandler("/v1/templates/structure/{id}", p.StructureHandler, GET)
// get contents of specified file
p.HTTPHandlers.RegisterHTTPHandler("/v1/templates/structure/{id}", p.FileContentsHandler, POST)
...
```

## Generator Overview

Our generator plugin uses CN-Infra's **kvscheduler** and **keyval** library to perform operations on Etcd only when a specific key has been created under Etcd. We use a **descriptor**, which assigns a key prefix and watches for a key to be created under that prefix. From Go's standard library, we use ```text/template``` for code generation and ```archive/tar``` to handle bundling the code into a downloadable tar file encoded in base64 format. An example of how the descriptor is registered is shown below:

```golang
...
// REGISTERING THE DESCRIPTOR
// Init handlers
p.genHandler = gencalls.NewProjectHandler(p.Log, p.KVStore)

// Init & register descriptor
pluginDescriptor := descriptor.NewProjectDescriptor(p.Log, p.genHandler)
err := p.KVScheduler.RegisterKVDescriptor(pluginDescriptor)
if err != nil {
return err
}
p.Log.Info("Project descriptor registered")
...
```
