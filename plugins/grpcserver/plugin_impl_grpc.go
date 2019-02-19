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

	pb "github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/ligato/cn-infra/infra"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
)

// RegisterFlags registers command line flags.
func RegisterFlags() {
	address := flag.String("address", "localhost:9111", "address of GRPC server")
	socketType := flag.String("socket-type", "tcp", "[tcp, tcp4, tcp6, unix, unixpacket]")
	reqPer := flag.Int("request-period", 3, "notification request period in seconds")
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
	p.Log.Debug("GRPC server should be up and running!")

	return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
	return nil
}

// ***************************************
// Grpc Server Handlers
// ***************************************

// CreatePlugin inserts a new plugin into the kv
func (s *GrpcService) CreatePlugin(ctx context.Context, in *pb.CreatePluginRequest) (*pb.PluginData, error) {
	return &pb.PluginData{Id: "example", CdnLink: "example.com", Status: "OK"}, nil
}

// GetPlugin retrieves a given plugin
func (s *GrpcService) GetPlugin(ctx context.Context, in *pb.GetPluginRequest) (*pb.PluginData, error) {
	return &pb.PluginData{Id: "example", CdnLink: "example.com", Status: "OK"}, nil
}

// ListPlugins lists all currently stored plugins
func (s *GrpcService) ListPlugins(ctx context.Context, in *empty.Empty) (*pb.ListPluginsResponse, error) {
	// Use a loop to send back repeated data
}

// DeletePlugin deletes a currently stored plugin
func (s *GrpcService) DeletePlugin(ctx context.Context, in *pb.DeletePluginRequest) (*empty.Empty, error) {
	return nil, nil
}
