package grpccalls

import (
	"github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	"github.com/ligato/cn-infra/db/keyval"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/logging/logrus"
)

// PluginAPI provides methods for CRUD operations on etcd
type PluginAPI interface {
	PluginWrite
}

// PluginWrite provides write methods for ETCD
type PluginWrite interface {
	// CreatePlugin adds new plugin to etcd
	CreatePlugin(val *model.Plugin) error
	// DeletePlugin deletes plugin from etcd
	DeletePlugin(key string) error
}

// PluginHandler is accessor to etcd related grpccall methods
type PluginHandler struct {
	log    logging.Logger
	broker keyval.ProtoBroker
}

// NewPluginHandler creates new instance of PluginHandler
func NewPluginHandler(log logging.Logger, broker keyval.ProtoBroker) *PluginHandler {
	if log == nil {
		log = logrus.NewLogger("plugin-handler")
	}
	return &PluginHandler{
		log:    log,
		broker: broker,
	}
}
