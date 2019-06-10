---
title: "Understanding key parts of the Agent"
last updated: "June 2019"
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
// delete a project
p.HTTPHandlers.RegisterHTTPHandler("/v1/projects/{id}", p.DeleteProjectHandler, DELETE)
// save project plugins to generate code
p.HTTPHandlers.RegisterHTTPHandler("/v1/templates/{id}", p.GenerateHandler, POST)
// get generated zip file
p.HTTPHandlers.RegisterHTTPHandler("/v1/templates", p.GetGeneratedFileHandler, GET)

// Notice that while the code generator stores into etcd an object describing file structure and contents, there is no REST endpoin to retrieve that information. This is because the generated template structure is retrieved directly from etcd by the frontend.
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

# Code Generation

The Generator creates 2 data objects: 1 is a zip file of generated folders and code files representing a project, and the other is a representation of the folder structure of the project directory, as well as the contents of each .go and .md file. 

An example of the folder structure returned looks like this for a project with 1 additional custom plugin

``` json
{
"structure": [
{"name":"projectname","absolutePath":"/projectname","fileType":"folder","children":["/projectname/cmd","/projectname/plugins","/projectname/README.md"]},
{"name":"cmd","absolutePath":"/projectname/cmd","fileType":"folder","children":["/projectname/cmd/agent"]},
{"name":"agent","absolutePath":"/projectname/cmd/agent","fileType":"folder","children":["/projectname/cmd/agent/main.go","/projectname/cmd/agent/doc.go"]},
{"name":"main.go","absolutePath":"/projectname/cmd/agent/main.go","fileType":"file","children":[]},
{"name":"doc.go","absolutePath":"/projectname/cmd/agent/doc.go","fileType":"file","children":[]},
{"name":"plugins","absolutePath":"/projectname/plugins","fileType":"folder","children":["/projectname/plugins/custompluginname"]},
{"name":"custompluginname","absolutePath":"/projectname/plugins/custompluginname","fileType":"folder","children":["/projectname/plugins/custompluginname/doc.go","/projectname/plugins/custompluginname/options.go","/projectname/plugins/custompluginname/plugin_impl_custompluginname.go"]}...],

"files": [
{"fileName":"readme.md","content":"<contents of readme.md file>"},
{"fileName":"main.go","content":"<contents of main.go file>"},
{"fileName":"doc.go","content":"package main"},
{"fileName":"custompluginname/doc.go","content":"package CustomPluginPackageName"},
{"fileName":"custompluginname/options.go","content":"<contents of custom plugin options.go file>"},
{"fileName":"custompluginname/plugin_impl.go","content":"<contents of custom plugin impl.go file>"}]
}
```

The generated code contents are created by populating ```text/template``` templates with the correct syntax of project information and plugins selected by the user. 

This is done through the ```fillXTemplate()``` methods found in the ```codeGen_X.go``` files in the ```gencalls``` directory, where X is a name describing the generated file template. These fillXTemplate() methods specify the data and label to be used in the template. It also calls the generic ```fillTemplate()``` method specifying the template name, template (which can be found in the respective ```X_template.go``` files), and data values (as an object) to be inserted into the template. Additionally, data values for each of the 16 agent-level plugins used to populate the generated main.go can be found in ```main_agent_template_vars.go```.

Finally, to create the tar file with the generated folders and files, the ```generate()``` method in project_gencalls.go creates the project directory with generated code contents, and ```createTar()``` writes that content from generate() into a tar representation.