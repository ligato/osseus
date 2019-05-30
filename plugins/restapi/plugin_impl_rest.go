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
	"net/http"

	"github.com/ligato/cn-infra/servicelabel"

	"github.com/ligato/cn-infra/db/keyval"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/rest"
)

//go:generate protoc --proto_path=restmodel --proto_path=$GOPATH/src --gogo_out=restmodel ./restmodel/rest_project.proto
//go:generate protoc --proto_path=restmodel --proto_path=$GOPATH/src --gogo_out=restmodel ./restmodel/rest_template_structure.proto

// REST api methods
const (
	GET    = http.MethodGet
	POST   = http.MethodPost
	DELETE = http.MethodDelete
)

// Label holds the serviceLabel value set by the user
var Label string

// Plugin holds the internal data structures of the Rest Plugin
type Plugin struct {
	Deps

	// broker for etcd operations
	broker keyval.ProtoBroker
}

// Deps groups the dependencies of the Rest Plugin.
type Deps struct {
	infra.PluginDeps
	ServiceLabel servicelabel.ReaderAPI
	HTTPHandlers rest.HTTPHandlers
	KVStore      keyval.KvProtoPlugin
}

// Init initializes the Rest Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	// Get servicelabel from flag
	Label = p.ServiceLabel.GetAgentLabel()

	return nil
}

// AfterInit can be used to register HTTP handlers
func (p *Plugin) AfterInit() (err error) {
	// Calls handlers to be exposed
	p.registerHandlersHere()

	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	return nil
}
