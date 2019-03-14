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
)

const (
	// PluginDescriptorName is the name of the descriptor plugin
	PluginDescriptorName = "plugin"
)

// PluginDescriptor is our descriptor
type PluginDescriptor struct {
	log logging.Logger
}

// NewPluginDescriptor creates a new instance of the descriptor.
func NewPluginDescriptor(log logging.PluginLogger) *PluginDescriptor {
	// Set plugin descriptor init values
	return &PluginDescriptor{
		log: log.NewLogger("plugin-descriptor"),
	}
}

// GetDescriptor returns descriptor suitable for registration (via adapter) with the KVScheduler.
func (d *PluginDescriptor) GetDescriptor() *adapter.PluginDescriptor {
	return &adapter.PluginDescriptor{
		Name:          PluginDescriptorName,
		NBKeyPrefix:   model.ModelPlugin.KeyPrefix(),
		ValueTypeName: model.ModelPlugin.ProtoName(),
		KeySelector:   model.ModelPlugin.IsKeyValid,
		KeyLabel:      model.ModelPlugin.StripKeyPrefix,
		Create:        d.Create,
		Delete:        d.Delete,
		UpdateWithRecreate: func(key string, oldValue, newValue *model.Plugin, metadata interface{}) bool {
			// Modify always performed via re-creation
			return true
		},
	}
}

// Create creates new value.
func (d *PluginDescriptor) Create(key string, value *model.Plugin) (metadata interface{}, err error) {
	return nil, nil
}

// Delete removes an existing value.
func (d *PluginDescriptor) Delete(key string, value *model.Plugin, metadata interface{}) error {
	return nil
}
