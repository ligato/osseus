// Copyright (c) 2017 Cisco and/or its affiliates.
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

package main

import (
	"log"

	"github.com/ligato/cn-infra/agent"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
	"github.com/ligato/cn-infra/rpc/rest"
)

// PluginName represents name of plugin.
const PluginName = "grpcServer"

func main() {
	p := &Server{
		GRPC: grpc.NewPlugin(
			grpc.UseHTTP(&rest.DefaultPlugin),
		),
		Log: logging.ForPlugin(PluginName),
	}

	a := agent.NewAgent(agent.AllPlugins(p))

	if err := a.Run(); err != nil {
		log.Fatal(err)
	}
}

// Server presents main plugin.
type Server struct {
	Log  logging.PluginLogger
	GRPC grpc.Server
}

// String return name of the plugin.
func (plugin *Server) String() string {
	return PluginName
}

// Init demonstrates the usage of PluginLogger API.
func (plugin *Server) Init() error {
	plugin.Log.Info("Registering connection")

	return nil
}

// Close closes the plugin.
func (plugin *Server) Close() error {
	return nil
}
