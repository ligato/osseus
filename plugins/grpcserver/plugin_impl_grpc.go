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
	"flag"
	"fmt"

	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/datasync/kvdbsync"
	"github.com/ligato/cn-infra/rpc/grpc"

	"github.com/anthonydevelops/osseus/plugins/grpcserver/descriptor"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/vpp-agent/plugins/kvscheduler"
	"github.com/ligato/vpp-agent/plugins/orchestrator"
)

// (*) Generate Models:
//go:generate protoc --proto_path=model --proto_path=$GOPATH/src --gogo_out=model ./model/model.proto

// (**) Generate Descriptors:
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
}

// Deps represent Plugin dependencies.
type Deps struct {
	infra.PluginDeps
	Grpc         grpc.Server
	Orchestrator *orchestrator.Plugin
	Scheduler    *kvscheduler.Scheduler
	ETCDDataSync *kvdbsync.Plugin
	Watcher      datasync.KeyValProtoWatcher
	Publisher    datasync.KeyProtoValWriter
}

// Init initializes the Grpc Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)
	pluginDescriptor := descriptor.NewPluginDescriptor(p.Log)
	err := p.Scheduler.RegisterKVDescriptor(pluginDescriptor)
	if err != nil {
		return err
	}

	return nil
}

// AfterInit can be used to register HTTP handlers
func (p *Plugin) AfterInit() (err error) {
	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	return nil
}
