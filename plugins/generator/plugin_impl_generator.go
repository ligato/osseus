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
	"time"

	"github.com/ligato/cn-infra/db/keyval"

	"github.com/anthonydevelops/osseus/plugins/generator/descriptor"
	"github.com/anthonydevelops/osseus/plugins/generator/descriptor/adapter"
	"github.com/anthonydevelops/osseus/plugins/generator/model"
	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/vpp-agent/plugins/kvscheduler"
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
	Publisher datasync.KeyProtoValWriter
	Scheduler *kvscheduler.Scheduler
	KVStore   keyval.KvProtoPlugin
}

// Init initializes the Generator Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	// Init & register descriptors
	p.pluginDescriptor = descriptor.NewPluginDescriptor(p.Log)
	pluginDescriptor := adapter.NewPluginDescriptor(p.pluginDescriptor.GetDescriptor())
	err := p.Scheduler.RegisterKVDescriptor(pluginDescriptor)
	if err != nil {
		return err
	}
	p.Log.Info("Plugin descriptor registered")

	p.templateDescriptor = descriptor.NewTemplateDescriptor(p.Log)
	templateDescriptor := adapter.NewTemplateDescriptor(p.templateDescriptor.GetDescriptor())
	err = p.Scheduler.RegisterKVDescriptor(templateDescriptor)
	if err != nil {
		return err
	}
	p.Log.Info("Template descriptor registered")

	// Init plugin watcher & template broker
	p.broker = p.KVStore.NewBroker(templateDescriptor.NBKeyPrefix)
	watcher := p.KVStore.NewWatcher(pluginDescriptor.NBKeyPrefix)
	err = watcher.Watch(p.consumer, p.watchCh, "")
	if err != nil {
		return err
	}

	return nil
}

// AfterInit is NOOP
func (p *Plugin) AfterInit() (err error) {
	return nil
}

// Close stops all associated go routines & channels
func (p *Plugin) Close() error {
	close(p.watchCh)
	return nil
}

// Capture changes and perform operations based on change type
func (p *Plugin) consumer(resp datasync.ProtoWatchResp) {
	switch resp.GetChangeType() {
	case datasync.Put:
		// Recognize the change
		value := new(model.Plugin)
		if err := resp.GetValue(value); err != nil {
			p.Log.Errorf("GetValue for change failed: %v", err)
			return
		}
		p.Log.Infof("Put op, Key: %q Value: %+v", resp.GetKey(), value)
		time.Sleep(time.Second * 2)
		// Define new data
		template := &model.Template{
			Name:   "test_template",
			Result: "test_result",
		}
		// Send data back to etcd under template prefix
		if err := p.broker.Put("test", template); err != nil {
			p.Log.Errorf("Put failed: %v", err)
		}
		p.Log.Infof("Return data, Key: 'test' Value: %+v", template)
	case datasync.Delete:
		p.Log.Infof("Delete op, Key: %q", resp.GetKey())
	}
}
