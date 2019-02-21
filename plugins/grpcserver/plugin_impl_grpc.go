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

	pb "github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	"github.com/ligato/cn-infra/config"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
)

const (
	// DefaultHost is a host used by default
	DefaultHost = "0.0.0.0"
	// DefaultHTTPPort is a port used by default
	DefaultHTTPPort = "9191"
	// DefaultEndpoint 0.0.0.0:9191
	DefaultEndpoint = DefaultHost + ":" + DefaultHTTPPort
)

// Flag variables
var (
	cfg        string
	address    string
	socketType string
	reqPer     int64
)

// RegisterFlags registers command line flags.
func RegisterFlags() {
	fmt.Println("Registering cmd line flags...")
	flag.StringVar(&cfg, "grpcserver-config", "grpc.conf", "config file for GRPC")
	flag.StringVar(&address, "address", "localhost:9111", "address of GRPC server")
	flag.StringVar(&socketType, "socket-type", "tcp", "[tcp, tcp4, tcp6, unix, unixpacket]")
	flag.Int64Var(&reqPer, "request-period", 3, "notification request period in seconds")
	flag.Parse()
}

// Simple command line flags call
func init() {
	RegisterFlags()
}

// Plugin holds the internal data structures of the Grpc Plugin
type Plugin struct {
	Deps
	grpcConf grpc.Config
}

// Deps represent Plugin dependencies.
type Deps struct {
	infra.PluginDeps
	GRPC         grpc.Server
	PluginConfig config.PluginConfig
}

// GrpcService implements GRPC GrpcServer interface
type GrpcService struct{}

// Init initializes the Grpc Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)
	p.Log.Info("Loading plugin config ", p.PluginConfig.GetConfigName())

	found, err := p.PluginConfig.LoadValue(p.grpcConf)
	if err != nil {
		p.Log.Error("Error loading config", err)
	} else if found {
		p.Log.Info("Loaded plugin config - found external configuration ", p.PluginConfig.GetConfigName())
	} else {
		p.Log.Info("Could not load config ... default taken")
	}

	// Register server for use
	pb.RegisterGrpcServer(p.Deps.GRPC.GetServer(), &GrpcService{})

	return nil
}

// AfterInit can be used to register HTTP handlers
func (p *Plugin) AfterInit() (err error) {
	// Create server/client conn
	grpc.ListenAndServe(&p.grpcConf, p.Deps.GRPC.GetServer())

	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	p.Close()
	return nil
}

// func (p *Plugin) getGrpcConfig() (*Config, error) {
// 	var grpcCfg p.grpcConf
// 	found, err := p.Deps.Cfg.LoadValueCfg(&grpcCfg)
// 	if err != nil {
// 		return &grpcCfg, err
// 	}

// 	if !found {
// 		p.Log.Info("GRPC config not found, skip loading this plugin")
// 		p.disabled = true
// 	}

// 	return &grpcCfg, nil
// }
