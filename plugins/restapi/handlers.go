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
	"github.com/unrolled/render"
	"io/ioutil"
	"net/http"
)

var pluginIdNum = "pluginIdNum"

type Response struct {
	PluginId   string
}

// Registers REST handlers
func (p *Plugin) registerHandlersHere() {

	p.registerHTTPHandler("/", GET, func() (interface{}, error) {
		return p.HomeDisplay()
	})
	p.registerHTTPBodyHandler("/pluginId", POST, func() (interface{}, error){
		return p.RequestPluginId()
	})
}
// registerHTTPHandler is common register method for all handlers
func (p *Plugin) registerHTTPHandler(key string, method string, f func() (interface{}, error)) {
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
	p.Deps.HTTPHandlers.RegisterHTTPHandler(key, handlerFunc, method)
}

func (p *Plugin) registerHTTPBodyHandler(key string, method string, f func() (interface{}, error)) {
	handlerFunc := func(formatter *render.Render) http.HandlerFunc {
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

			pluginId, ok := reqParam["PluginId"]
			if !ok || pluginId == "" {
				errMsg := fmt.Sprintf("400 Bad request: pluginId parameter missing or empty\n")
				p.Log.Error(errMsg)
				p.logError(formatter.JSON(w, http.StatusBadRequest, errMsg))
				return
			}
			pluginIdNum = pluginId
			p.Log.Debugf("PluginId: %v", pluginId)
		}
	}
	p.RequestPluginId()
	p.Deps.HTTPHandlers.RegisterHTTPHandler(key, handlerFunc, method)
}



// handler for default path, displays default ping to verify if server is up
func (p *Plugin) HomeDisplay() (interface{}, error) {
	return "Hello World!", nil
}

// handler for /pluginId, posts specified plugin Id
func (p *Plugin) RequestPluginId() (interface{}, error){
	/*response := Response{pluginIdNum}
	res, err := json.Marshal(response)
	fmt.Printf("%s",res)
	return res, err*/
	p.Log.Debug("reached requestpluginId")
	return "plugin", nil
}

// logError logs non-nil errors from JSON formatter
func (p *Plugin) logError(err error) {
	if err != nil {
		p.Log.Error(err)
	}
}
