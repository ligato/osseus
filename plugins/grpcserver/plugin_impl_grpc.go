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
	"errors"

	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/logging/logrus"
	"github.com/ligato/cn-infra/rpc/grpc"
)

// KVServer presents main plugin.
type KVServer struct {
	Log  logging.PluginLogger
	GRPC grpc.Server
}

// PluginRoutesService is used to implement pb.PluginRoutesServer.
type PluginRoutesService struct{}

// String return name of the plugin.
func (plugin *KVServer) String() string {
	return PluginName
}

// Init demonstrates the usage of PluginLogger API.
func (plugin *KVServer) Init() error {
	plugin.Log.Info("Registering server")

	pb.RegisterPluginRoutesServer(plugin.GRPC.GetServer(), &PluginRoutesService{})

	return nil
}

// Close closes the plugin.
func (plugin *KVServer) Close() error {
	return nil
}

// GetPlugin to illustrate a possible call
func (*PluginRoutesService) GetPlugin(ctx context.Context, request *pb.Plugin) (*pb.PluginData, error) {
	if request.Id == "" {
		return nil, errors.New("not filled id in the request")
	}
	logrus.DefaultLogger().Infof("greeting client: %v", request.Id)

	return &pb.PluginData{Id: "plugin1", CdnLink: "https://example.com", Code: nil}, nil
}
