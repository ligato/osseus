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

//go:generate protoc --proto_path=model --proto_path=$GOPATH/src --gogo_out=model ./model/plugin.proto
//go:generate protoc --proto_path=model --proto_path=$GOPATH/src --gogo_out=model ./model/template.proto
//go:generate descriptor-adapter --descriptor-name Plugin --value-type *model.Plugin --import "model" --output-dir "descriptor"
//go:generate descriptor-adapter --descriptor-name Template --value-type *model.Template --import "model" --output-dir "descriptor"

package generator

import (
	"github.com/ligato/cn-infra/db/keyval"

	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/osseus/plugins/generator/descriptor"
	kvs "github.com/ligato/vpp-agent/plugins/kvscheduler/api"
)

// Plugin holds the internal data structures of the Generator Plugin
type Plugin struct {
	Deps
	broker keyval.ProtoBroker

	// channels & watcher
	watchCh chan string

	// descriptors
	pluginDescriptor   *descriptor.PluginDescriptor
	templateDescriptor *descriptor.TemplateDescriptor
}

// Deps represent Plugin dependencies.
type Deps struct {
	infra.PluginDeps
	Publisher   datasync.KeyProtoValWriter
	KVStore     keyval.KvProtoPlugin
	KVScheduler kvs.KVScheduler
}

// Init initializes the Generator Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	pluginDescriptor := descriptor.NewPluginDescriptor(p.Log, p.KVStore)
	err := p.KVScheduler.RegisterKVDescriptor(pluginDescriptor)
	if err != nil {
		return err
	}
	p.Log.Info("Plugin descriptor registered")

	templateDescriptor := descriptor.NewTemplateDescriptor(p.Log)
	err = p.KVScheduler.RegisterKVDescriptor(templateDescriptor)
	if err != nil {
		return err
	}
	p.Log.Info("Template descriptor registered")

	return nil
}

// AfterInit is NOOP
func (p *Plugin) AfterInit() (err error) {
	return nil
}

// Close stops all associated go routines & channels
func (p *Plugin) Close() error {
	// close(p.watchCh)
	return nil
}
