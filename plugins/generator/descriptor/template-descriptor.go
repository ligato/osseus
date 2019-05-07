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
	"github.com/ligato/osseus/plugins/generator/model"
	kvs "github.com/ligato/vpp-agent/plugins/kvscheduler/api"
)

const (
	// TemplateDescriptorName is the name of the descriptor plugin
	TemplateDescriptorName = "template"
)

// TemplateDescriptor is our descriptor
type TemplateDescriptor struct {
	log logging.Logger
}

// NewTemplateDescriptor creates a new instance of the descriptor.
func NewTemplateDescriptor(log logging.PluginLogger) *kvs.KVDescriptor {
	// Set plugin descriptor init values
	descCtx := &TemplateDescriptor{
		log: log.NewLogger("template-descriptor"),
	}

	typedDescr := &adapter.TemplateDescriptor{
		Name:          TemplateDescriptorName,
		NBKeyPrefix:   model.ModelTemplate.KeyPrefix(),
		ValueTypeName: model.ModelTemplate.ProtoName(),
		KeySelector:   model.ModelTemplate.IsKeyValid,
		KeyLabel:      model.ModelTemplate.StripKeyPrefix,
		Create:        descCtx.Create,
		Delete:        descCtx.Delete,
		UpdateWithRecreate: func(key string, oldValue, newValue *model.Template, metadata interface{}) bool {
			// Modify always performed via re-creation
			return true
		},
	}
	return adapter.NewTemplateDescriptor(typedDescr)
}

// Create creates new value.
func (d *TemplateDescriptor) Create(key string, value *model.Template) (metadata interface{}, err error) {
	return nil, nil
}

// Delete removes an existing value.
func (d *TemplateDescriptor) Delete(key string, value *model.Template, metadata interface{}) error {
	return nil
}
