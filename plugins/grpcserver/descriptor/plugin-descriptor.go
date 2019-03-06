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

	"github.com/anthonydevelops/osseus/plugins/grpcserver/descriptor/adapter"
	"github.com/anthonydevelops/osseus/plugins/grpcserver/model"
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
func NewPluginDescriptor(broker keyval.ProtoBroker, log logging.PluginLogger) *PluginDescriptor {
	// Set plugin descriptor init values
	return &PluginDescriptor{
		log:    log.NewLogger("plugin-descriptor"),
		broker: broker,
	}
}

// GetDescriptor returns descriptor suitable for registration (via adapter) with the KVScheduler.
func (d *PluginDescriptor) GetDescriptor() *adapter.PluginDescriptor {
	return &adapter.PluginDescriptor{
		Name:                 PluginDescriptorName,
		NBKeyPrefix:          model.ModelPlugin.KeyPrefix(),
		ValueTypeName:        model.ModelPlugin.ProtoName(),
		KeySelector:          model.ModelPlugin.IsKeyValid,
		KeyLabel:             model.ModelPlugin.StripKeyPrefix,
		ValueComparator:      d.EquivalentValues,
		Validate:             d.Validate,
		Create:               d.Create,
		Delete:               d.Delete,
		Update:               d.Update,
		UpdateWithRecreate:   d.UpdateWithRecreate,
		Retrieve:             d.Retrieve,
		IsRetriableFailure:   d.IsRetriableFailure,
		DerivedValues:        d.DerivedValues,
		Dependencies:         d.Dependencies,
		RetrieveDependencies: []string{},
	}
}

// EquivalentValues compares two revisions of the same value for equality.
func (d *PluginDescriptor) EquivalentValues(key string, old, new *model.Plugin) bool {
	// compare **non-primary** attributes here (none in the Plugin)
	return true
}

// Validate validates value before it is applied.
func (d *PluginDescriptor) Validate(key string, value *model.Plugin) error {
	return nil
}

// Create creates new value.
func (d *PluginDescriptor) Create(key string, value *model.Plugin) (metadata interface{}, err error) {
	err = d.broker.Put(key, value)
	if err != nil {
		d.log.Errorf("Error in create")
		return key, err
	}
	return "Created: " + key, nil
}

// Delete removes an existing value.
func (d *PluginDescriptor) Delete(key string, value *model.Plugin, metadata interface{}) error {
	existed, err := d.broker.Delete(key)
	if err != nil {
		d.log.Errorf("Error in deletion")
		return err
	}
	d.log.Infof("Plugin existed: %v", existed)
	return err
}

// Update updates existing value.
func (d *PluginDescriptor) Update(key string, old, new *model.Plugin, oldMetadata interface{}) (newMetadata interface{}, err error) {
	return nil, nil
}

// UpdateWithRecreate returns true if value update requires full re-creation.
func (d *PluginDescriptor) UpdateWithRecreate(key string, old, new *model.Plugin, metadata interface{}) bool {
	return false
}

// Retrieve retrieves values from SB.
func (d *PluginDescriptor) Retrieve(correlate []adapter.PluginKVWithMetadata) (retrieved []adapter.PluginKVWithMetadata, err error) {
	return retrieved, nil
}

// IsRetriableFailure returns true if the given error, returned by one of the CRUD
// operations, can be theoretically fixed by merely repeating the operation.
func (d *PluginDescriptor) IsRetriableFailure(err error) bool {
	return true
}

// DerivedValues breaks the value into multiple part handled/referenced
// separately.
func (d *PluginDescriptor) DerivedValues(key string, value *model.Plugin) (derived []kvs.KeyValuePair) {
	return derived
}

// Dependencies lists dependencies of the given value.
func (d *PluginDescriptor) Dependencies(key string, value *model.Plugin) (deps []kvs.Dependency) {
	return deps
}
