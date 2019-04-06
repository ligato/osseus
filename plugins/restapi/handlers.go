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

	p.registerHTTPHandler("/", GET, func() (interface{}, error) {
		return p.GetServerStatus()
	})
	p.HTTPHandlers.RegisterHTTPHandler("/osseus/v1/projects/save", p.registerSaveProject, POST)
	p.HTTPHandlers.RegisterHTTPHandler("/demo/generate", p.registerGenerate, POST)

}

// registerHTTPHandler is common register method for all handlers without JSON body input
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
			p.Deps.Log.Debugf("Rest uri: %s, data: %v", key, res)
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

		//p.Log.Debug("project name: ", reqParam.ProjectName)
		//p.Log.Debug("plugins", reqParam.Plugins)
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

func (p *Plugin) SaveMultiplePlugins(response Response) (interface{}, error) {
	p.Log.Debug("REST API post /osseus/v1/projects/save plugin reached")
	p.Log.Debug("response obj is: ", response)
	p.Log.Debug("response name is: ", response.ProjectName)
	p.Log.Debug("response plugins is: ", response.Plugins)
	p.genUpdater(response, projectsPrefix)
	return response, nil
}

func (p *Plugin) SavePluginsToGenerate(responses []Response) (interface{}, error) {
	p.Log.Debug("REST API post /demo/saveMultiple plugin reached")
	for i := 0; i < len(responses); i++ {
		p.genUpdater(responses[i], genPrefix)
	}
	return responses, nil
}
//updates the key that the generator watches on
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
	p.Log.Debug("kv store should have %v at key %v", value, key)
}

// logError logs non-nil errors from JSON formatter
func (p *Plugin) logError(err error) {
	if err != nil {
		p.Log.Error(err)
	}
}
