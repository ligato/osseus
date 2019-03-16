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
	"github.com/ligato/cn-infra/db/keyval"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/osseus/plugins/generator/descriptor/adapter"
	"github.com/ligato/osseus/plugins/generator/model"
	kvs "github.com/ligato/vpp-agent/plugins/kvscheduler/api"
)

const (
	// PluginDescriptorName is the name of the descriptor plugin
	PluginDescriptorName = "plugin"
)

// PluginDescriptor is our descriptor
type PluginDescriptor struct {
	log    logging.Logger
	broker keyval.ProtoBroker
}

// NewPluginDescriptor creates a new instance of the descriptor.
func NewPluginDescriptor(log logging.PluginLogger, KVStore keyval.KvProtoPlugin) *kvs.KVDescriptor {
	// Set plugin descriptor init values
	descCtx := &PluginDescriptor{
		log:    log,
		broker: KVStore.NewBroker("/vnf-agent/vpp1/" + model.ModelTemplate.KeyPrefix()),
	}

	typedDescr := &adapter.PluginDescriptor{
		Name:          PluginDescriptorName,
		NBKeyPrefix:   model.ModelPlugin.KeyPrefix(),
		ValueTypeName: model.ModelPlugin.ProtoName(),
		KeySelector:   model.ModelPlugin.IsKeyValid,
		KeyLabel:      model.ModelPlugin.StripKeyPrefix,
		Create:        descCtx.Create,
		Delete:        descCtx.Delete,
		UpdateWithRecreate: func(key string, oldValue, newValue *model.Plugin, metadata interface{}) bool {
			// Modify always performed via re-creation
			return true
		},
	}

	return adapter.NewPluginDescriptor(typedDescr)
}

// Create creates new value.
func (d *PluginDescriptor) Create(key string, value *model.Plugin) (metadata interface{}, err error) {
	// Define template model for test
	template := &model.Template{
		Name:   "test_template",
		Result: "test_result",
	}

	// Store test data into new template keyprefix
	if err := d.broker.Put("test", template); err != nil {
		d.log.Errorf("Put failed: %v", err)
	}
	d.log.Infof("Return data, Key: %q Value: %+v", key, value)

	return nil, nil
}

// Delete removes an existing value.
func (d *PluginDescriptor) Delete(key string, value *model.Plugin, metadata interface{}) error {
	d.log.Infof("Delete op, Key: %q", key)
	return nil
}
