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
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
)

// PluginName represents name of plugin
const PluginName = "grpcserver"

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
	flag.StringVar(&cfg, "grpc-config", "grpc.conf", "config file for GRPC")
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
	GRPC grpc.Server
}

// Deps represent Plugin dependencies.
type Deps struct {
	infra.PluginDeps
}

// GrpcService implements GRPC GrpcServer interface
type GrpcService struct{}

// Init initializes the Grpc Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	// Register server for use
	pb.RegisterGrpcServer(p.GRPC.GetServer(), &GrpcService{})

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
