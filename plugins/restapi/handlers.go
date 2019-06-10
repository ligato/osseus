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

	"github.com/ligato/osseus/plugins/restapi/restmodel"

	"github.com/unrolled/render"
)

var (
	// genPrefix has the generator's watcher watching on this key for changes to generate
	genPrefix = "/config/generator/v1/generate_template/"
	// projectsPrefix has all the saved projects
	projectsPrefix = "/config/generator/v1/projects/"
	// templatePrefix has the stored structure and zip files
	templatePrefix = "/config/generator/v1/template/"
)

// Project struct from etcd for projects
type Project struct {
	ProjectName   string
	Plugins       []Plugins
	AgentName     string
	CustomPlugins []CustomPlugin
}

// CustomPlugin struct to marshal input
type CustomPlugin struct {
	PluginName  string
	PackageName string
}

// Plugins struct to marshal input
type Plugins struct {
	PluginName string
	Selected   bool
	ID         int32
	Port       int32
}

// TemplateStructure struct from etcd for code structure
type TemplateStructure struct {
	Directories []File
}

// File struct in Template Structure
type File struct {
	Name         string
	AbsolutePath string
	FileType     string
	Children     []string
}

// ZipFile struct used to marshal generated code file
type ZipFile struct {
	Name    string
	TarFile string
}

// FilePath struct used to specify file in template structure
// can be "/{pluginName}/doc" or "/doc" if agent-level file
type FilePath struct {
	FilePath string
}

// FileContents struct to return contents of generated code file
type FileContents struct {
	FileContents string
}

// Registers REST handlers
func (p *Plugin) registerHandlersHere() {
	/*** Handlers for managing projects ***/
	// save project state
	p.HTTPHandlers.RegisterHTTPHandler("/v1/projects", p.SaveProjectHandler, POST)
	// delete a project
	p.HTTPHandlers.RegisterHTTPHandler("/v1/projects/{id}", p.DeleteProjectHandler, DELETE)

	/*** Handlers for Code Generation ***/
	// save project plugins to generate code
	p.HTTPHandlers.RegisterHTTPHandler("/v1/templates/{id}", p.GenerateHandler, POST)
	// get generated zip file
	p.HTTPHandlers.RegisterHTTPHandler("/v1/templates", p.GetGeneratedFileHandler, GET)
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

// GenerateHandler handles generating a new project template, or updating an existing one
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

// GetGeneratedFileHandler loads the generated code file from etcd
func (p *Plugin) GetGeneratedFileHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		// Retrieve generated zip file from etcd
		key := "zip"
		zipFile := p.getGeneratedFile(templatePrefix, key)

		// Send value back to client
		w.Header().Set("Content-Type", "application/json")
		zipFileJSON, _ := json.Marshal(zipFile)

		w.WriteHeader(http.StatusOK)
		w.Write(zipFileJSON)
	}
}

/*
=========================
 ETCD Functions
=========================
*/

// updates the prefix key with the given project information for generation
func (p *Plugin) genUpdater(proj Project, prefix string, key string) {
	p.setBroker(prefix)

	// Get value based on key
	value := new(restmodel.Project)
	pluginval := new(restmodel.Plugin)
	custompluginval := new(restmodel.CustomPlugin)
	found, _, err := p.broker.GetValue(key, value)

	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No plugins found..")
	} else {
		p.Log.Infof("Found some plugins: %+v", value)
	}

	// Prepare data
	var pluginsList []*restmodel.Plugin
	var customPluginsList []*restmodel.CustomPlugin

	// Create a Plugins list that will be stored in etcd
	for _, plugin := range proj.Plugins {
		pluginval = &restmodel.Plugin{
			PluginName: plugin.PluginName,
			Id:         plugin.ID,
			Selected:   plugin.Selected,
			Port:       plugin.Port,
		}
		pluginsList = append(pluginsList, pluginval)
	}

	//create CustomPlugins list that will be stored in etcd
	for _, customPlugin := range proj.CustomPlugins {
		custompluginval = &restmodel.CustomPlugin{
			PluginName:  customPlugin.PluginName,
			PackageName: customPlugin.PackageName,
		}
		customPluginsList = append(customPluginsList, custompluginval)
	}

	//create Project object to be stored in etcd
	value = &restmodel.Project{
		ProjectName:  proj.ProjectName,
		Plugin:       pluginsList,
		AgentName:    proj.AgentName,
		CustomPlugin: customPluginsList,
	}

	// Update value in KV store
	if err := p.broker.Put(key, value); err != nil {
		p.Log.Errorf("Put failed: %v", err)
	}
	p.Log.Debugf("kv store should have (key): %v at (prefix): %v", key, prefix)
}

// returns the generated zip file
func (p *Plugin) getGeneratedFile(prefix string, key string) interface{} {
	p.setBroker(prefix)

	// Get value based on key (zip, because only 1 zip entry is stored per project)
	value := new(restmodel.Template)
	found, _, err := p.broker.GetValue(key, value)

	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No plugins found..")
	} else {
		p.Log.Infof("Found some plugins: %+v", value)
	}

	// map zip contents into ZipFile object
	zipFile := ZipFile{
		Name:    value.Name,
		TarFile: value.TarFile,
	}

	return zipFile
}

// returns true if value at key is deleted, false otherwise
// used to delete project entries in etcd
func (p *Plugin) deleteValue(prefix string, key string) interface{} {
	p.setBroker(prefix)
	existed, err := p.broker.Delete(key)
	if err != nil {
		log.Fatal(err)
	}

	return existed
}

// sets the broker based on passed-in prefix
func (p *Plugin) setBroker(prefix string) {
	keyPrefix := "/vnf-agent/" + Label + prefix
	p.broker = p.KVStore.NewBroker(keyPrefix)
}

// logError logs non-nil errors from JSON formatter
func (p *Plugin) logError(err error) {
	if err != nil {
		p.Log.Error(err)
	}
}
