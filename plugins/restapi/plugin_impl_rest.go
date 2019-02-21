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
//

package restapi

import (
	"github.com/ligato/cn-infra/config"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/rest"
	"net/http"
)

const PluginName = "restapi"

// REST api methods
const (
	GET  = http.MethodGet
	POST = http.MethodPost
)

/*var(
	cfg	string
)*/

// RegisterFlags registers command line flags.
func RegisterFlags() {
	//flag.StringVar(&cfg,"restapi-config", "http.conf", "load rest api conf" )
	//flag.Parse()
	// TODO: add command line flags here
}

func init() {
	RegisterFlags()
}

// Plugin holds the internal data structures of the Rest Plugin
type Plugin struct {
	Deps
	conf rest.Config
}

// Deps groups the dependencies of the Rest Plugin.
type Deps struct {
	infra.PluginDeps
	HTTPHandlers rest.HTTPHandlers
	pluginconf config.PluginConfig
}

// Init initializes the Rest Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	p.pluginconf = config.ForPlugin(PluginName)

	print("configname",p.pluginconf.GetConfigName())

	p.Log.Info("loading plugin config", p.pluginconf.GetConfigName())

	found, err := p.pluginconf.LoadValue(p.conf)
	if err != nil {
		p.Log.Error("Error loading config", err)
	} else if found {
		p.Log.Info("Loaded plugin config - found external configuration ", p.pluginconf.GetConfigName())
	} else {
		p.Log.Info("Could not load config ... default taken")
	}
	return nil
}

// AfterInit can be used to register HTTP handlers
func (p *Plugin) AfterInit() (err error) {

	p.Log.Debug("REST API Plugin should be up and running ;) ")
	p.registerHandlersHere()
	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	return nil
}
