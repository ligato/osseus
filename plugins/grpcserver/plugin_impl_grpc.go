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
