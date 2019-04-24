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
	"net/http"

	"github.com/ligato/cn-infra/db/keyval"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/rest"
)

//Generate model:
//go:generate protoc --proto_path=model --proto_path=$GOPATH/src --gogo_out=model ./model/restmodel.proto

// REST api methods
const (
	GET  = http.MethodGet
	POST = http.MethodPost
	DELETE = http.MethodDelete
)

// RegisterFlags registers command line flags.
func RegisterFlags() {
	// TODO: add command line flags here
}

func init() {
	RegisterFlags()
}

// Plugin holds the internal data structures of the Rest Plugin
type Plugin struct {
	Deps
}

// Deps groups the dependencies of the Rest Plugin.
type Deps struct {
	infra.PluginDeps
	HTTPHandlers rest.HTTPHandlers
	KVStore      keyval.KvProtoPlugin
	watchCloser  chan string
}

// Init initializes the Rest Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)
	if p.KVStore.Disabled() {
		p.Log.Error("KV store is disabled")
	}
	return nil
}

// AfterInit can be used to register HTTP handlers
func (p *Plugin) AfterInit() (err error) {
	p.Log.Debug("REST API Plugin started ")
	p.registerHandlersHere()
	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	return nil
}
