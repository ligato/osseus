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
	"time"

	"github.com/gorilla/mux"

	"github.com/ligato/osseus/plugins/restapi/model"

	"github.com/unrolled/render"
)

const genPrefix = "/vnf-agent/vpp1/config/generator/v1/project/"
const projectsPrefix = "/projects/v1/plugins/"

type Response struct {
	ProjectName string
	Plugins     []Plugins
}
type Plugins struct {
	PluginName string
	Id         int32
	Selected   bool
	Port       int32
}

// Registers REST handlers
func (p *Plugin) registerHandlersHere() {

	//save project state
	p.HTTPHandlers.RegisterHTTPHandler("/v1/projects", p.SaveProjectHandler, POST)
	//load project state for project with name = {id}
	p.HTTPHandlers.RegisterHTTPHandler("/v1/projects/{id}", p.LoadProjectHandler, GET)
	// delete a project
	p.HTTPHandlers.RegisterHTTPHandler("/v1/projects/{id}", p.DeleteProjectHandler ,DELETE)
	//save project plugins to generate code
	p.HTTPHandlers.RegisterHTTPHandler("/v1/templates/{id}", p.GenerateHandler, POST)
}

//registers handler for /v1/projects/ save endpoint
func (p *Plugin) SaveProjectHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		var reqParam Response
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		p.SaveProject(reqParam)

		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

func (p *Plugin) LoadProjectHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		vars := mux.Vars(req)
		pId := vars["id"]
		projectInfo, err := p.LoadProject(pId)
		if err != nil {
			errMsg := fmt.Sprintf("500 Internal server error: request failed: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusInternalServerError, errMsg))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		projectJson, _ := json.Marshal(projectInfo)
		// projectJson := json.NewEncoder(w).Encode(projectInfo)
		p.logError(formatter.JSON(w, http.StatusOK, projectJson))

	}
}

func (p *Plugin) DeleteProjectHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		vars := mux.Vars(req)
		pId := vars["id"]
		projectInfo, err := p.DeleteProject(pId)
		if err != nil{
			errMsg := fmt.Sprintf("500 Internal server error: request failed: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusInternalServerError, errMsg))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		projectJson := json.NewEncoder(w).Encode(projectInfo)
		p.logError(formatter.JSON(w, http.StatusOK, projectJson))

	}
}

//registers handler for generate endpoint
func (p *Plugin) GenerateHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		var reqParam Response
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		vars := mux.Vars(req)
		pId := vars["id"]
		p.SavePluginsToGenerate(reqParam, pId)

		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

// handler for default path, displays message to verify if server endpoint is up
func (p *Plugin) GetServerStatus() (interface{}, error) {
	p.Log.Debug("REST API default home endpoint is up")
	return "Ligato-gen server is up", nil
}

//save project
func (p *Plugin) SaveProject(response Response) (interface{}, error) {
	p.Log.Debug("REST API post /v1/projects save project reached")
	p.genUpdater(response, projectsPrefix, response.ProjectName)
	return response, nil
}

//get project from given id
func (p *Plugin) LoadProject(projectId string) (interface{}, error) {
	p.Log.Debug("REST API Get /v1/projects/{id} load project reached with id: ", projectId)
	projectValue := p.getValue(projectsPrefix, projectId)
	return projectValue, nil
}

// delete project with given id
func (p *Plugin) DeleteProject(projectId string) (interface{}, error) {
	p.Log.Debug("REST API Del /v1/projects/{id} delete project reached with id: ", projectId)
	projectValue := p.deleteValue(projectsPrefix, projectId)
	return projectValue, nil
}

func (p *Plugin) SavePluginsToGenerate(response Response, projectId string) (interface{}, error) {
	p.Log.Debug("REST API post /v1/templates generator plugin reached")
	p.genUpdater(response, genPrefix, projectId)
	return response, nil
}

//updates the prefix key with the given response
func (p *Plugin) genUpdater(response Response, prefix string, key string) {
	broker := p.KVStore.NewBroker(prefix)

	value := new(model.Project)
	pluginval := new(model.Plugin)
	found, _, err := broker.GetValue(key, value)

	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No plugins found..")
	} else {
		p.Log.Infof("Found some plugins: %+v", value)
	}

	// Wait few seconds
	time.Sleep(time.Second * 2)

	p.Log.Infof("updating..")

	// Prepare data
	var pluginsList []*model.Plugin

	for i := 0; i < len(response.Plugins); i++ {
		pluginval = &model.Plugin{
			PluginName: response.Plugins[i].PluginName,
			Id:         response.Plugins[i].Id,
			Selected:   response.Plugins[i].Selected,
			Port:       response.Plugins[i].Port,
		}
		pluginsList = append(pluginsList, pluginval)
	}

	value = &model.Project{
		ProjectName: response.ProjectName,
		Plugin:      pluginsList,
	}

	// Update value in KV store
	if err := broker.Put(key, value); err != nil {
		p.Log.Errorf("Put failed: %v", err)
	}
	p.Log.Debugf("kv store should have %v at key %v", value, key)
}

// returns the value at specified key
func (p *Plugin) getValue(prefix string, key string) interface{} {
	broker := p.KVStore.NewBroker(prefix)
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

	for i := 0; i < len(value.Plugin); i++ {
		pluginval := Plugins{
			PluginName: value.Plugin[i].PluginName,
			Id:         value.Plugin[i].Id,
			Selected:   value.Plugin[i].Selected,
			Port:       value.Plugin[i].Port,
		}
		pluginsList = append(pluginsList, pluginval)
	}
	project := Response{
		ProjectName: value.ProjectName,
		Plugins:     pluginsList,
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
