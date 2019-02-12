package main

import (
	"log"

	"github.com/ligato/cn-infra/agent"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/rpc/grpc"
	"github.com/ligato/cn-infra/rpc/rest"
)

// *************************************************************************
// This file contains GRPC service exposure example. To register service use
// Server.RegisterService(descriptor, service)
// ************************************************************************/

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
	plugin.Log.Info("Registering server")

	pb.RegisterPluginRoutesServer(plugin.GRPC.GetServer(), &PluginService{})

	return nil
}

// Close closes the plugin.
func (plugin *Server) Close() error {
	return nil
}

// PluginService implements GRPC GreeterServer interface (interface generated from protobuf definition file).
// It is a simple implementation for testing/demo only purposes.
type PluginService struct{}
