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

package descriptor

import (
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/osseus/plugins/generator/descriptor/adapter"
	"github.com/ligato/osseus/plugins/generator/gencalls"
	"github.com/ligato/osseus/plugins/generator/model"
	kvs "github.com/ligato/vpp-agent/plugins/kvscheduler/api"
)

const (
	// ProjectDescriptorName is the name of the descriptor project
	ProjectDescriptorName = "project"
)

// ProjectDescriptor is our descriptor
type ProjectDescriptor struct {
	log      logging.Logger
	handlers gencalls.ProjectAPI
}

// NewProjectDescriptor creates a new instance of the descriptor.
func NewProjectDescriptor(log logging.PluginLogger, handlers gencalls.ProjectAPI) *kvs.KVDescriptor {
	// Set project descriptor init values
	descCtx := &ProjectDescriptor{
		log:      log,
		handlers: handlers,
	}

	typedDescr := &adapter.ProjectDescriptor{
		Name:          ProjectDescriptorName,
		NBKeyPrefix:   model.ModelProject.KeyPrefix(),
		ValueTypeName: model.ModelProject.ProtoName(),
		KeySelector:   model.ModelProject.IsKeyValid,
		KeyLabel:      model.ModelProject.StripKeyPrefix,
		Create:        descCtx.Create,
		Delete:        descCtx.Delete,
		UpdateWithRecreate: func(key string, oldValue, newValue *model.Project, metadata interface{}) bool {
			// Modify always performed via re-creation
			return true
		},
	}

	return adapter.NewProjectDescriptor(typedDescr)
}

// Create creates new value.
func (d *ProjectDescriptor) Create(key string, value *model.Project) (metadata interface{}, err error) {
	if err := d.handlers.GenAddProj(key, value); err != nil {
		d.log.Errorf("Put failed: %v", err)
	}

	return nil, nil
}

// Delete removes an existing value.
func (d *ProjectDescriptor) Delete(key string, value *model.Project, metadata interface{}) error {
	if err := d.handlers.GenDelProj(value); err != nil {
		d.log.Errorf("Delete failed: %v", err)
	}

	return nil
}
