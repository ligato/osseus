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

package grpcserver

import (
	"context"
	"flag"
	"fmt"
	"strings"
	"sync"

	"github.com/anthonydevelops/osseus/plugins/grpcserver/descriptor"
	"github.com/anthonydevelops/osseus/plugins/grpcserver/descriptor/adapter"
	"github.com/anthonydevelops/osseus/plugins/grpcserver/grpccalls"
	"github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/datasync/kvdbsync"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
	"github.com/ligato/vpp-agent/plugins/kvscheduler"
)

// (*) Generate Models:
//go:generate protoc --proto_path=model --proto_path=$GOPATH/src --gogo_out=model ./model/plugin.proto

// (*) Generate Descriptors:
//go:generate descriptor-adapter --descriptor-name Plugin --value-type *model.Plugin --import "model" --output-dir "descriptor"

// prefix for db conn
const keyPrefix = "/grpcserver/"

// Flag variables
var (
	address    string
	socketType string
	etcdCfg    string
	grpcCfg    string
)

// RegisterFlags registers command line flags.
func RegisterFlags() {
	fmt.Println("Registering cmd line flags...")
	flag.StringVar(&address, "address", "localhost:9111", "address of GRPC server")
	flag.StringVar(&socketType, "socket-type", "tcp", "[tcp, tcp4, tcp6, unix, unixpacket]")
	flag.StringVar(&grpcCfg, "grpc-config", "grpc.conf", "config file for GRPC")
	flag.StringVar(&etcdCfg, "etcd-config", "etcd.conf", "config file for ETCD")
	flag.Parse()
}

// Simple command line flags call
func init() {
	RegisterFlags()
}

// Plugin holds the internal data structures of the Grpc Plugin
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
	pluginHandler grpccalls.PluginAPI

	// descriptors
	pluginDescriptor *descriptor.PluginDescriptor
}

// Deps represent Plugin dependencies.
type Deps struct {
	infra.PluginDeps
	Grpc         grpc.Server
	Scheduler    *kvscheduler.Scheduler
	ETCDDataSync *kvdbsync.Plugin
	Watcher      datasync.KeyValProtoWatcher
	Publisher    datasync.KeyProtoValWriter
}

// Init initializes the Grpc Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	// Setup plugin fields.
	p.resyncChannel = make(chan datasync.ResyncEvent)
	p.changeChannel = make(chan datasync.ChangeEvent)
	p.ctx, p.cancel = context.WithCancel(context.Background())

	// Init plugin handler
	p.pluginHandler = grpccalls.NewPluginHandler(p.Log)

	// Init & register plugin descriptor
	p.pluginDescriptor = descriptor.NewPluginDescriptor(p.Log, p.pluginHandler)
	pluginDescriptor := adapter.NewPluginDescriptor(p.pluginDescriptor.GetDescriptor())
	err := p.Scheduler.RegisterKVDescriptor(pluginDescriptor)
	if err != nil {
		return err
	}
	p.Log.Info("Descriptor registered")

	// Start watching for incoming requests
	err = p.startWatcher()
	if err != nil {
		return err
	}

	return nil
}

// Handle asynchronous requests coming through and call respective
// CRUD operation upon parsing the message
func (p *Plugin) consumer() {
	p.Log.Info("Watcher started")
	for {
		select {
		case req := <-p.changeChannel:
			// Parse data change
			chng := req.GetChanges()
			for _, val := range chng {
				// Check key matches our prefix
				key := val.GetKey()
				if strings.HasPrefix(key, keyPrefix) {
					txn := p.Scheduler.StartNBTransaction()

					switch val.GetChangeType() {
					// Handle put op to etcd
					case datasync.Put:
						plugin := &model.Plugin{}
						p.Log.Infof("Creating/Updating ", key)
						// Get value & stage txn
						err := val.GetValue(plugin)
						if err != nil {
							p.Log.Error("Could not retrieve value")
							return
						}
						txn.SetValue(key, plugin)
					// Handle delete op to etcd
					case datasync.Delete:
						p.Log.Infof("Deleting ", key)
						// Stage deletion in txn
						txn.SetValue(key, nil)
					}

					// Commit transaction
					seq, err := txn.Commit(p.ctx)
					if err != nil {
						p.Log.Errorf("Transaction commit invalid: %v", err)
						return
					}
					p.Log.Infof("Sequence #: %v", seq)
				}
			}
			// Done signal found, stop consumer
		case <-p.ctx.Done():
			p.Log.Debugf("Stopped watching for incoming events")
			return
		}
	}
}

// Starts watcher on a given channel to monitor for incoming requests
func (p *Plugin) startWatcher() error {
	// Subscribe etcd watcher
	p.Log.Info("Starting ETCD Watcher")
	reg, err := p.Watcher.Watch("Grpcserver plugin", p.changeChannel, p.resyncChannel, keyPrefix)
	if err != nil {
		p.Log.Infof("Error: %v", err)
		return err
	}
	p.watchDataReg = reg
	p.Log.Info("Watcher subscribed to etcd")

	p.wg.Add(1)
	go p.consumer()

	return nil
}

// AfterInit can be used to register HTTP handlers
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
