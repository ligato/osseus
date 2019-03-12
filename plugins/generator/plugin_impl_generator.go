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
//go:generate descriptor-adapter --descriptor-name Plugin --value-type *model.Plugin --import "model" --output-dir "descriptor"

package generator

import (
	"context"
	"strings"
	"sync"

	"github.com/anthonydevelops/osseus/plugins/generator/descriptor"
	"github.com/anthonydevelops/osseus/plugins/generator/descriptor/adapter"
	"github.com/anthonydevelops/osseus/plugins/generator/gencalls"
	"github.com/anthonydevelops/osseus/plugins/generator/model"
	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/datasync/kvdbsync"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/vpp-agent/plugins/kvscheduler"
)

// Plugin holds the internal data structures of the Generator Plugin
type Plugin struct {
	Deps

	// channels & watcher
	changeChannel chan datasync.ChangeEvent
	resyncChannel chan datasync.ResyncEvent
	ctx           context.Context
	cancel        context.CancelFunc
	wg            sync.WaitGroup

	// watcher registration
	watchDataReg datasync.WatchRegistration

	// plugin handlers
	pluginHandler gencalls.PluginAPI

	// descriptors
	pluginDescriptor *descriptor.PluginDescriptor
}

// Deps represent Plugin dependencies.
type Deps struct {
	infra.PluginDeps
	Scheduler    *kvscheduler.Scheduler
	ETCDDataSync *kvdbsync.Plugin
	Watcher      datasync.KeyValProtoWatcher
	Publisher    datasync.KeyProtoValWriter
}

// Init initializes the Generator Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	// Setup channels & context fields
	p.resyncChannel = make(chan datasync.ResyncEvent)
	p.changeChannel = make(chan datasync.ChangeEvent)
	p.ctx, p.cancel = context.WithCancel(context.Background())

	// Init plugin handler
	p.pluginHandler = gencalls.NewPluginHandler(p.Log, p.changeChannel)

	// Init & register plugin descriptor
	p.pluginDescriptor = descriptor.NewPluginDescriptor(p.Log, p.pluginHandler)
	pluginDescriptor := adapter.NewPluginDescriptor(p.pluginDescriptor.GetDescriptor())
	err := p.Scheduler.RegisterKVDescriptor(pluginDescriptor)
	if err != nil {
		return err
	}
	p.Log.Info("Descriptor registered")

	// Start watching for incoming requests
	err = p.startWatcher(pluginDescriptor.NBKeyPrefix)
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
	p.cancel()
	close(p.changeChannel)
	close(p.resyncChannel)
	return nil
}

// Starts watcher on a given channel to monitor for incoming requests
func (p *Plugin) startWatcher(prefix string) error {
	// Subscribe etcd watcher
	p.Log.Info("Starting ETCD Watcher")
	reg, err := p.Watcher.Watch("Generator plugin", p.changeChannel, p.resyncChannel, prefix)
	if err != nil {
		p.Log.Infof("Error: %v", err)
		return err
	}
	p.watchDataReg = reg
	p.Log.Info("Watcher subscribed to Etcd")

	p.wg.Add(1)
	go p.consumer(prefix)

	return nil
}

// Handle asynchronous requests coming through and call respective
// operation upon parsing the message
func (p *Plugin) consumer(prefix string) {
	defer p.wg.Done()

	p.Log.Info("Watcher started")
	for {
		select {
		case req := <-p.changeChannel:
			// Parse data change
			chng := req.GetChanges()
			for _, val := range chng {
				// Check key matches our prefix
				key := val.GetKey()
				if strings.HasPrefix(key, prefix) {
					// Log key
					p.Log.Infof("Key change: ", key)
					plugin := &model.Plugin{}
					err := val.GetValue(plugin)
					if err != nil {
						p.Log.Error("Could not retrieve value")
						return
					}
					// Log value
					p.Log.Infof("Current value: ", plugin.GetTemplate())
				} else {
					p.Log.Warnf("Key (%v) does not match Prefix (%v)", key, prefix)
				}
			}
			// Done signal found, stop consumer
		case <-p.ctx.Done():
			p.Log.Debugf("Stopped watching for changes")
			return
		}
	}
}
