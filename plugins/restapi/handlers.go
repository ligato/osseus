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
)

// Response struct from etcd
type Response struct {
	ProjectName string
	Plugins     []Plugins
	CustomPlugins []CustomPlugins
}

// Plugins struct to marshal input
type Plugins struct {
	PluginName string
	ID         int32
	Selected   bool
	Port       int32
}

// CustomPlugins struct to marshal input
type CustomPlugins struct{
	CustomPluginName  string
	PackageName       string
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
}

// SaveProjectHandler handles saving projects to etcd
func (p *Plugin) SaveProjectHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var reqParam Response

		// Capture request body
		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		// Store JSON into Response struct
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
		projectInfo := p.getValue(projectsPrefix, pID)

		// Send value back to client
		w.Header().Set("Content-Type", "application/json")
		projectJSON, _ := json.Marshal(projectInfo)
		// projectJson := json.NewEncoder(w).Encode(projectInfo)
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
		var reqParam Response

		// Capture request body
		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		// Store JSON into Response struct
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

// updates the prefix key with the given response
func (p *Plugin) genUpdater(response Response, prefix string, key string) {
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
	for _, plugin :=  range response.Plugins{
		pluginval = &model.Plugin{
			PluginName: plugin.PluginName,
			Id:         plugin.ID,
			Selected:   plugin.Selected,
			Port:       plugin.Port,
		}
		pluginsList = append(pluginsList, pluginval)
	}

	//create CustomPlugins list that will be stored in etcd
	for _, customPlugin := range response.CustomPlugins{
		custompluginval = &model.CustomPlugin{
			CustomPluginName:    customPlugin.CustomPluginName,
			PackageName: 		 customPlugin.PackageName,
		}
		customPluginsList = append(customPluginsList, custompluginval)
	}

	value = &model.Project{
		ProjectName: response.ProjectName,
		Plugin:      pluginsList,
		CustomPlugin: customPluginsList,
	}

	// Update value in KV store
	if err := broker.Put(key, value); err != nil {
		p.Log.Errorf("Put failed: %v", err)
	}
	p.Log.Debugf("kv store should have (key) %v at (prefix) %v", key, prefix)
}

// returns the value at specified key
func (p *Plugin) getValue(prefix string, key string) interface{} {
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
	var customPluginsList []CustomPlugins

	// Create a Plugins list that will be stored in etcd
	for _, plugin := range value.Plugin{
		pluginval := Plugins{
			PluginName: plugin.PluginName,
			ID:         plugin.Id,
			Selected:   plugin.Selected,
			Port:       plugin.Port,
		}
		pluginsList = append(pluginsList, pluginval)
	}

	//create CustomPlugins list that will be stored in etcd
	for _, customPlugin := range value.CustomPlugin{
		custompluginval := CustomPlugins{
			CustomPluginName:    customPlugin.CustomPluginName,
			PackageName: 		 customPlugin.PackageName,
		}
		customPluginsList = append(customPluginsList, custompluginval)
	}
	project := Response{
		ProjectName: value.ProjectName,
		Plugins:     pluginsList,
		CustomPlugins:	customPluginsList,
	}

	return project
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
