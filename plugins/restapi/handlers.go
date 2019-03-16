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
	"osseus/plugins/restapi/model"
	"time"

	"github.com/unrolled/render"
)

const genPrefix = "/vnf-agent/vpp1/config/generator/v1/plugin/"

type Response struct {
	PluginName   string
}

// Registers REST handlers
func (p *Plugin) registerHandlersHere() {

	p.registerHTTPHandler("/", GET, func() (interface{}, error) {
		return p.GetServerStatus()
	})
	p.HTTPHandlers.RegisterHTTPHandler("/demo/save", p.registerHTTPBodyHandler, POST)
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

// registerHTTPBodyHandler is a common method that registers Http handlers that include a JSON body as input
func (p *Plugin) registerHTTPBodyHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to parse request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		var reqParam map[string]string
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		pluginName, ok := reqParam["pluginName"]
		if !ok || pluginName == "" {
			errMsg := fmt.Sprintf("400 Bad request: pluginName parameter missing or empty\n")
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}
		p.SavePlugin(pluginName)
		p.Log.Debugf("PluginName: %v", pluginName)
		p.logError(formatter.JSON(w, http.StatusOK, pluginName))
	}
}

// handler for default path, displays message to verify if server endpoint is up
func (p *Plugin) GetServerStatus() (interface{}, error) {
	p.Log.Debug("REST API default home endpoint is up")
	return "Ligato-gen server is up", nil
}

// handler for demo/save
// API endpoint frontend container should call to save plugin info
func (p *Plugin) SavePlugin(pluginName string) (interface{}, error){
	p.Log.Debug("REST API post /demo/save plugin reached")
	p.genUpdater(pluginName)
	return "placeholder", nil
}

//updates the key that the generator watches on
func (p *Plugin) genUpdater(pluginName string) {
	broker := p.KVStore.NewBroker(genPrefix)

	value := new(model.Greetings)
	found, _, err := broker.GetValue(pluginName, value) //todo update
	if err != nil {
		p.Log.Errorf("GetValue failed: %v", err)
	} else if !found {
		p.Log.Info("No greetings found..")
	} else {
		p.Log.Infof("Found some greetings: %+v", value)
	}

	// Wait few seconds
	time.Sleep(time.Second * 2)

	p.Log.Infof("updating..")

	// Prepare data
	value = &model.Greetings{
		PluginName: pluginName,
	}

	// Update value in KV store
	if err := broker.Put(pluginName, value); err != nil {
		p.Log.Errorf("Put failed: %v", err)
	}
}

// logError logs non-nil errors from JSON formatter
func (p *Plugin) logError(err error) {
	if err != nil {
		p.Log.Error(err)
	}
}