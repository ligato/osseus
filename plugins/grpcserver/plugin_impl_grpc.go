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
	"os"

	"github.com/ligato/cn-infra/db/keyval/kvproto"

	"github.com/ligato/cn-infra/config"

	pb "github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	"github.com/ligato/cn-infra/db/keyval/etcd"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
)

// PluginName represents name of plugin
const PluginName = "grpcserver"

// DB connects to ETCD with proto wrapper
var DB *kvproto.ProtoWrapper

// Flag variables
var (
	grpcCfg string
	dbCfg   string
)

// RegisterFlags registers command line flags.
func RegisterFlags() {
	fmt.Println("Registering cmd line flags...")
	flag.StringVar(&grpcCfg, "grpc-config", "grpc.conf", "config file for GRPC")
	flag.StringVar(&dbCfg, "etcd-config", "etcd.conf", "config file for ETCD")
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
	GRPC grpc.Server
	ETCD *etcd.Plugin
}

// GrpcService implements GRPC GrpcServer interface
type GrpcService struct{}

// Init initializes the Grpc Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	// Register server for use
	pb.RegisterGrpcServer(p.GRPC.GetServer(), &GrpcService{})
	p.Log.Info("Registered pb service")

	return nil
}

// AfterInit can be used to register HTTP handlers
func (p *Plugin) AfterInit() (err error) {
	// Get config files
	cfg, err := parseConfig()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Setup db connection
	db, err := etcd.NewEtcdConnectionWithBytes(*cfg, logging.DefaultLogger)
	if err != nil {
		fmt.Println(err)
		return
	}
	p.Log.Info("Establishing connection to etcd ...")

	// Initialize proto decorator
	DB = kvproto.NewProtoWrapper(db)

	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	return nil
}

// Parse etcd config file
func parseConfig() (cfg *etcd.ClientConfig, err error) {
	conf := &etcd.Config{}

	// Get config information and store it
	err = config.ParseConfigFromYamlFile(dbCfg, conf)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Parse config into a usable client config conn
	cfg, err = etcd.ConfigToClient(conf)
	if err != nil {
		fmt.Println(err)
		return
	}

	return cfg, nil
}
