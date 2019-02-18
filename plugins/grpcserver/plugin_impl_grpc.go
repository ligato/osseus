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

	pb "github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
)

const (
	defaultAddress    = "localhost:9111"
	defaultSocketType = "tcp"
)

var address = defaultAddress
var socketType = defaultSocketType

// RegisterFlags registers command line flags.
func RegisterFlags() {
	flag.StringVar("address", address, "address of GRPC server")
	flag.StringVar("socket-type", socketType, "socket type [tcp, tcp4, tcp6, unix, unixpacket]")
	flag.Parse()
}

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
}

// GrpcService implements GRPC ServerServer interface
type GrpcService struct{}

// Init initializes the Grpc Plugin
func (p *Plugin) Init() error {
	p.Log.SetLevel(logging.DebugLevel)

	// Register server for use
	pb.RegisterGrpcServer(p.GRPC.GetServer(), &ServerService{})

	return nil
}

// AfterInit can be used to register HTTP handlers
func (p *Plugin) AfterInit() (err error) {
	p.Log.Debug("GRPC server should be up and running!")
	// you would want to register your handlers here
	p.registerHandlersHere()

	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	return nil
}
