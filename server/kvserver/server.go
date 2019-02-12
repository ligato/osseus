package main

import (
	"context"
	"errors"
	"log"

	pb "github.com/anthonydevelops/osseus/server/kv"
	"github.com/ligato/cn-infra/agent"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/logging/logrus"
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
	p := &KVServer{
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
