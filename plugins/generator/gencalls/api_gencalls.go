package gencalls

import (
	"github.com/anthonydevelops/osseus/plugins/generator/model"
	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/logging"
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

// PluginHandler is accessor to etcd related gencalls methods
type PluginHandler struct {
	Log  logging.Logger
	resp chan datasync.ChangeEvent
}

// NewPluginHandler creates new instance of PluginHandler
func NewPluginHandler(Log logging.Logger, resp chan datasync.ChangeEvent) *PluginHandler {
	return &PluginHandler{
		Log:  Log,
		resp: resp,
	}
}
