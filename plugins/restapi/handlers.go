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
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/ligato/osseus/plugins/restapi/model"

	"github.com/unrolled/render"
)

const genPrefix = "/vnf-agent/vpp1/config/generator/v1/project/"
const projectsPrefix = "/projects/v1/plugins/"

type Response struct {
	ProjectName string
	Plugins     []Plugins
}
type Plugins struct{
	PluginName string
	Id         int32
	Selected   bool
	Port       int32
}

// Registers REST handlers
func (p *Plugin) registerHandlersHere() {

	//todo rename inside registering as a handler per url

	// maybe change to /v1/projects/{id}
	p.HTTPHandlers.RegisterHTTPHandler("/osseus/v1/projects/save", p.registerSaveProject, POST)
	//todo figure out how to register load handler
	/*p.registerHTTPHandler("/v1/projects/{id}", GET, func() (interface{}, error) {
		return p.LoadProject()
	})*/
	p.HTTPHandlers.RegisterHTTPHandler("/v1/projects/{id}", p.registerLoadProject, GET)
	p.HTTPHandlers.RegisterHTTPHandler("/demo/generate", p.registerGenerate, POST)

}

//temp
func (p *Plugin) registerLoadProject(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		vars := mux.Vars(req)
		pId := vars["id"]
		projectInfo, err := p.LoadProject(pId)
		p.Log.Debug("project Info from method is", projectInfo)
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

// registerHTTPHandler is common register method for all handlers without JSON body input and {id} variable at end
func (p *Plugin) registerHTTPHandler(key, method string, f func() (interface{}, error)) {
	handlerFunc := func(formatter *render.Render) http.HandlerFunc {
		return func(w http.ResponseWriter, req *http.Request) {

			res, err := f()
			if err != nil {
				errMsg := fmt.Sprintf("500 Internal server error: request failed: %v\n", err)
				p.Log.Error(errMsg)
				p.logError(formatter.JSON(w, http.StatusInternalServerError, errMsg))
				return
			}
			p.Log.Debugf("Rest uri: %s, data: %v", key, res)
			vars := mux.Vars(req)
			pId := vars["id"]
			p.LoadProject(pId)

			p.logError(formatter.JSON(w, http.StatusOK, res))
		}
	}
	p.HTTPHandlers.RegisterHTTPHandler(key, handlerFunc, method)
}

//registers handler for osseus/v1/projects/save endpoint
func (p *Plugin) registerSaveProject(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		//https://stackoverflow.com/questions/38867692/parse-json-array-in-golang
		var reqParam Response
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		p.SaveMultiplePlugins(reqParam)

		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

//registers handler for demo/generate endpoint
func (p *Plugin) registerGenerate(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		//https://stackoverflow.com/questions/38867692/parse-json-array-in-golang
		var reqParam []Response
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		p.SavePluginsToGenerate(reqParam)

		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

// handler for default path, displays message to verify if server endpoint is up
func (p *Plugin) GetServerStatus() (interface{}, error) {
	p.Log.Debug("REST API default home endpoint is up")
	return "Ligato-gen server is up", nil
}

//save project
// todo change name to SaveProject
func (p *Plugin) SaveMultiplePlugins(response Response) (interface{}, error) {
	p.Log.Debug("REST API post /osseus/v1/projects/save plugin reached")
	p.genUpdater(response, projectsPrefix)
	return response, nil
}

//get project from given id
func (p *Plugin) LoadProject(projectId string) (interface{}, error) {
	p.Log.Debug("REST API Get /v1/projects/{id} load plugin reached with id: ", projectId)
	projectValue := p.getValue(projectsPrefix, projectId)
	return projectValue, nil
}

func (p *Plugin) SavePluginsToGenerate(responses []Response) (interface{}, error) {
	p.Log.Debug("REST API post /demo/saveMultiple plugin reached")
	for i := 0; i < len(responses); i++ {
		p.genUpdater(responses[i], genPrefix)
	}
	return responses, nil
}

//updates the prefix key with the given response
func (p *Plugin) genUpdater(response Response, prefix string) {
	broker := p.KVStore.NewBroker(prefix)

	key := response.ProjectName
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
		Plugin: pluginsList,
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
		Plugins: pluginsList,
	}
	/*projectJson, err := json.Marshal(project)
	if err != nil {
		p.Log.Error(err)
	}*/
	//return projectJson
	return project
}

// logError logs non-nil errors from JSON formatter
func (p *Plugin) logError(err error) {
	if err != nil {
		p.Log.Error(err)
	}
}
