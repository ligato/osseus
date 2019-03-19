package gencalls

import (
	"github.com/ligato/cn-infra/db/keyval"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/osseus/plugins/generator/model"
)

// ProjectAPI provides methods for CRUD operations on etcd
type ProjectAPI interface {
	ProjectWrite
}

// ProjectWrite provides write methods for ETCD
type ProjectWrite interface {
	GenAddProj(key string, val *model.Project) error
	GenDelProj(val *model.Project) error
}

// ProjectHandler is accessor to etcd related grpccall methods
type ProjectHandler struct {
	log    logging.Logger
	broker keyval.ProtoBroker
}

// NewProjectHandler creates new instance of ProjectHandler
func NewProjectHandler(log logging.Logger, KVStore keyval.KvProtoPlugin) *ProjectHandler {
	return &ProjectHandler{
		log:    log,
		broker: KVStore.NewBroker("/vnf-agent/vpp1/" + model.ModelTemplate.KeyPrefix()),
	}
}
