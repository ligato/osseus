// Copyright (c) 2019 Cisco and/or its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package restapi

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/ligato/osseus/plugins/restapi/model"

	"github.com/unrolled/render"
)

const (
	genPrefix      = "/vnf-agent/vpp1/config/generator/v1/project/"
	projectsPrefix = "/projects/v1/plugins/"
	templatePrefix = "/vnf-agent/vpp1/config/generator/v1/template/"
)

// Project struct from etcd for projects
type Project struct {
	ProjectName string
	Plugins     []Plugins
	AgentName   string
	CustomPlugins []CustomPlugin
}

// CustomPlugins struct to marshal input
type CustomPlugin struct{
	PluginName string
	PackageName string
}

// Plugins struct to marshal input
type Plugins struct {
	PluginName string
	Selected   bool
	Id         int32
	Port       int32
}

// Template Structure struct from etcd for code structure
type TemplateStructure struct{
	directories    []File
}

// File struct in Template Structure
type File struct{
	name           string
	absolutePath   string
	fileType       string
	etcdKey       string
	children      []string
}

// FilePath struct used to specify file in template structure
// can be "/{pluginName}/doc" or "/doc" if agent-level file
type FilePath struct{
	filePath    string
}

// FileContents struct to return contents of generated code file
type FileContents struct{
	fileContents string
}

// Registers REST handlers
func (p *Plugin) registerHandlersHere() {
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

}

/*
=========================
 REST Handler Functions
=========================
*/

// SaveProjectHandler handles saving projects to etcd
func (p *Plugin) SaveProjectHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var reqParam Project

		// Capture request body
		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		// Store JSON into Project struct
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		// Store project in etcd under project prefix
		p.genUpdater(reqParam, projectsPrefix, reqParam.ProjectName)

		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

// LoadProjectHandler loads a project from etcd
func (p *Plugin) LoadProjectHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// Retrieve value from etcd
		vars := mux.Vars(req)
		pID := vars["id"]
		projectInfo := p.getProject(projectsPrefix, pID)

		// Send value back to client
		w.Header().Set("Content-Type", "application/json")
		projectJSON, _ := json.Marshal(projectInfo)

		p.logError(formatter.JSON(w, http.StatusOK, projectJSON))
	}
}

// DeleteProjectHandler deletes a stored project from etcd
func (p *Plugin) DeleteProjectHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// Delete value from etcd
		vars := mux.Vars(req)
		pID := vars["id"]
		projectInfo := p.deleteValue(projectsPrefix, pID)

		// Return status back to client
		w.Header().Set("Content-Type", "application/json")
		projectJSON := json.NewEncoder(w).Encode(projectInfo)
		p.logError(formatter.JSON(w, http.StatusOK, projectJSON))
	}
}

// GenerateHandler handles generating a new template project
func (p *Plugin) GenerateHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var reqParam Project

		// Capture request body
		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		// Store JSON into Project struct
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		// Send project to trigger template generator
		vars := mux.Vars(req)
		pID := vars["id"]
		p.genUpdater(reqParam, genPrefix, pID)

		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

// StructureHandler handles retrieving generated code folder structure
func (p *Plugin) StructureHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// Retrieve value from etcd
		vars := mux.Vars(req)
		pID := vars["id"]
		templateStructure := p.getStructure(templatePrefix, "structure/" + pID)

		// Send value back to client
		w.Header().Set("Content-Type", "application/json")
		structureJson, _ := json.Marshal(templateStructure)

		p.logError(formatter.JSON(w, http.StatusOK, structureJson))
	}
}

// FileContentsHandler handles retrieving contents of a specific generated code file
func (p *Plugin) FileContentsHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// Retrieve value from etcd
		vars := mux.Vars(req)
		pID := vars["id"]

		// Capture request body
		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		var reqParam FilePath
		// Store JSON into FilePathName struct
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		fileContents := p.getFileContents(templatePrefix, "structure/" + pID + reqParam.filePath)

		// Send value back to client
		w.Header().Set("Content-Type", "application/json")
		contentsJson, _ := json.Marshal(fileContents)

		p.logError(formatter.JSON(w, http.StatusOK, contentsJson))
	}
}

/*
=========================
 ETCD Functions
=========================
*/

// updates the prefix key with the given project information for generation
func (p *Plugin) genUpdater(proj Project, prefix string, key string) {
	broker := p.KVStore.NewBroker(prefix)

	// Get value based on key
	value := new(model.Project)
	pluginval := new(model.Plugin)
	custompluginval := new(model.CustomPlugin)
	found, _, err := broker.GetValue(key, value)

	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No plugins found..")
	} else {
		p.Log.Infof("Found some plugins: %+v", value)
	}

	// Prepare data
	var pluginsList []*model.Plugin
	var customPluginsList []*model.CustomPlugin

	// Create a Plugins list that will be stored in etcd
	for _, plugin :=  range proj.Plugins{
		pluginval = &model.Plugin{
			PluginName: plugin.PluginName,
			Id:         plugin.Id,
			Selected:   plugin.Selected,
			Port:       plugin.Port,
		}
		pluginsList = append(pluginsList, pluginval)
	}

	//create CustomPlugins list that will be stored in etcd
	for _, customPlugin := range proj.CustomPlugins{
		custompluginval = &model.CustomPlugin{
			PluginName:    customPlugin.PluginName,
			PackageName: 		 customPlugin.PackageName,
		}
		customPluginsList = append(customPluginsList, custompluginval)
	}

	value = &model.Project{
		ProjectName: proj.ProjectName,
		Plugin:      pluginsList,
		AgentName:   proj.AgentName,
		CustomPlugin: customPluginsList,
	}

	// Update value in KV store
	if err := broker.Put(key, value); err != nil {
		p.Log.Errorf("Put failed: %v", err)
	}
	p.Log.Debugf("kv store should have (key) %v at (prefix) %v", key, prefix)
}

// returns the Project at specified key {projectName}
func (p *Plugin) getProject(prefix string, key string) interface{} {
	broker := p.KVStore.NewBroker(prefix)

	// Get value based on key
	value := new(model.Project)
	found, _, err := broker.GetValue(key, value)

	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No plugins found..")
	} else {
		p.Log.Infof("Found some plugins: %+v", value)
	}

	var pluginsList []Plugins
	var customPluginsList []CustomPlugin

	// Create a Plugins list to be returned
	for _, plugin := range value.Plugin{
		pluginval := Plugins{
			PluginName: plugin.PluginName,
			Id:         plugin.Id,
			Selected:   plugin.Selected,
			Port:       plugin.Port,
		}
		pluginsList = append(pluginsList, pluginval)
	}

	//create CustomPlugins list to be returned
	for _, customPlugin := range value.CustomPlugin{
		custompluginval := CustomPlugin{
			PluginName:    customPlugin.PluginName,
			PackageName: 		 customPlugin.PackageName,
		}
		customPluginsList = append(customPluginsList, custompluginval)
	}
	project := Project{
		ProjectName: value.ProjectName,
		Plugins:     pluginsList,
		AgentName:   value.AgentName,
		CustomPlugins:	customPluginsList,
	}

	return project
}

// returns template structure as directory of files
func (p *Plugin) getStructure(prefix string, key string) interface{} {
	broker := p.KVStore.NewBroker(prefix)

	// Get value based on key
	value := new(model.TemplateStructure)
	found, _, err := broker.GetValue(key, value)

	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No template structure found..")
	} else {
		p.Log.Infof("Found template structure: %+v", value)
	}

	var directoriesList []File
	for _, file := range value.File{
		fileEntry := File{
			name:    file.Name,
			absolutePath: file.AbsolutePath,
			fileType:     file.FileType,
			etcdKey:   file.EtcdKey,
			children:   file.Children,
		}
		directoriesList = append(directoriesList, fileEntry)
	}

	structure := TemplateStructure{
		directories: directoriesList,
	}

	return structure
}

// returns contents of specified file
func (p *Plugin) getFileContents(prefix string, key string) interface{} {
	broker := p.KVStore.NewBroker(prefix)

	// Get value based on key
	value := new(model.FileContent)
	found, _, err := broker.GetValue(key, value)

	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No file contents found..")
	} else {
		p.Log.Infof("Found file contents: %+v", value)
	}

	contents := FileContents{
		fileContents:    value.Content,
	}
	return contents
}


// returns true if value at key deleted, false otherwise
func (p *Plugin) deleteValue(prefix string, key string) interface{} {
	broker := p.KVStore.NewBroker(prefix)
	existed, err := broker.Delete(key)
	if err != nil {
		log.Fatal(err)
	}

	return existed
}

// logError logs non-nil errors from JSON formatter
func (p *Plugin) logError(err error) {
	if err != nil {
		p.Log.Error(err)
	}
}
