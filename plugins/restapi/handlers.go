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

// Response from ui
type Response struct {
	PluginName string
	ID         int32
	Selected   bool
	Image      string
	Port       int32
}

// Registers REST handlers
func (p *Plugin) registerHandlersHere() {

	p.registerHTTPHandler("/", GET, func() (interface{}, error) {
		return p.GetServerStatus()
	})
	p.HTTPHandlers.RegisterHTTPHandler("/demo/save", p.registerHTTPBodyHandler, POST)
	p.HTTPHandlers.RegisterHTTPHandler("/demo/saveMultiple", p.registerSaveMultiple, POST)
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

		reqParam := Response{}
		err = json.Unmarshal(body, &reqParam)
		if err != nil {
			errMsg := fmt.Sprintf("400 Bad request: failed to unmarshall request body: %v\n", err)
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		if reqParam.PluginName == "" {
			errMsg := fmt.Sprintf("400 Bad request: pluginName parameter missing or empty\n")
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		if reqParam.Image == "" {
			errMsg := fmt.Sprintf("400 Bad request: pluginImage parameter missing or empty\n")
			p.Log.Error(errMsg)
			p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
			return
		}

		p.SavePlugin(reqParam)

		p.Log.Debugf("PluginName: %v", reqParam.PluginName)
		p.Log.Debugf("PluginId: %v", reqParam.ID)
		p.Log.Debugf("PluginSelected: %v", reqParam.Selected)
		p.Log.Debugf("PluginImage: %v", reqParam.Image)
		p.Log.Debugf("PluginPort: %v", reqParam.Port)
		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

//registers handler for demo/saveMultiple endpoint
func (p *Plugin) registerSaveMultiple(formatter *render.Render) http.HandlerFunc {
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

		p.SaveMultiplePlugins(reqParam)

		p.logError(formatter.JSON(w, http.StatusOK, reqParam))
	}
}

// GetServerStatus for default path, displays message to verify if server endpoint is up
func (p *Plugin) GetServerStatus() (interface{}, error) {
	p.Log.Debug("REST API default home endpoint is up")
	return "Ligato-gen server is up", nil
}

// SavePlugin for demo/save
// API endpoint frontend container should call to save plugin info
func (p *Plugin) SavePlugin(response Response) (interface{}, error) {
	p.Log.Debug("REST API post /demo/save plugin reached")
	p.genUpdater(response)
	return response, nil
}

// SaveMultiplePlugins to save an array of incoming plugins
func (p *Plugin) SaveMultiplePlugins(responses []Response) (interface{}, error) {
	p.Log.Debug("REST API post /demo/saveMultiple plugin reached")
	for i := 0; i < len(responses); i++ {
		p.genUpdater(responses[i])
	}
	return responses, nil
}

//updates the key that the generator watches on
func (p *Plugin) genUpdater(response Response) {
	broker := p.KVStore.NewBroker(genPrefix)

	key := response.PluginName
	value := new(model.Plugin)
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
	value = &model.Plugin{
		PluginName: response.PluginName,
		Id:         response.ID,
		Selected:   response.Selected,
		Image:      response.Image,
		Port:       response.Port,
	}

	// Update value in KV store
	if err := broker.Put(key, value); err != nil {
		p.Log.Errorf("Put failed: %v", err)
	}
}

// logError logs non-nil errors from JSON formatter
func (p *Plugin) logError(err error) {
	if err != nil {
		p.Log.Error(err)
	}
}
