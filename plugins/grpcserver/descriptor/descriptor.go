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

	"github.com/anthonydevelops/osseus/plugins/grpcserver/descriptor/adapter"
	"github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	kvs "github.com/ligato/vpp-agent/plugins/kvscheduler/api"
)

const (
	// PluginDescriptorName is the name of the descriptor skeleton.
	PluginDescriptorName = "plugin"
)

// PluginDescriptor is only a skeleton of a descriptor, which can be used
// as a starting point to build a new descriptor from.
type PluginDescriptor struct {
	log logging.Logger
}

// NewPluginDescriptor creates a new instance of the descriptor.
func NewPluginDescriptor(log logging.PluginLogger) *kvs.KVDescriptor {
	// descriptors are supposed to be stateless, so use the structure only
	// as a context for things that do not change once the descriptor is
	// constructed - e.g. a reference to the logger to use within the descriptor
	descrCtx := &PluginDescriptor{
		log: log.NewLogger("plugin-descriptor"),
	}

	// use adapter to convert typed descriptor into generic descriptor API
	typedDescr := &adapter.PluginDescriptor{
		Name:                 PluginDescriptorName,
		NBKeyPrefix:          model.ValueModel.KeyPrefix(),
		ValueTypeName:        model.ValueModel.ProtoName(),
		KeySelector:          model.ValueModel.IsKeyValid,
		KeyLabel:             model.ValueModel.StripKeyPrefix,
		ValueComparator:      descrCtx.EquivalentValues,
		Validate:             descrCtx.Validate,
		Create:               descrCtx.Create,
		Delete:               descrCtx.Delete,
		Update:               descrCtx.Update,
		UpdateWithRecreate:   descrCtx.UpdateWithRecreate,
		Retrieve:             descrCtx.Retrieve,
		IsRetriableFailure:   descrCtx.IsRetriableFailure,
		DerivedValues:        descrCtx.DerivedValues,
		Dependencies:         descrCtx.Dependencies,
		RetrieveDependencies: []string{}, // list the names of the descriptors to Retrieve first
	}
	return adapter.NewPluginDescriptor(typedDescr)
}

// EquivalentValues compares two revisions of the same value for equality.
func (d *PluginDescriptor) EquivalentValues(key string, old, new *model.Plugin) bool {
	// compare **non-primary** attributes here (none in the ValueSkeleton)
	return true
}

// Validate validates value before it is applied.
func (d *PluginDescriptor) Validate(key string, value *model.Plugin) error {
	return nil
}

// Create creates new value.
func (d *PluginDescriptor) Create(key string, value *model.Plugin) (metadata interface{}, err error) {
	return nil, nil
}

// Delete removes an existing value.
func (d *PluginDescriptor) Delete(key string, value *model.Plugin, metadata interface{}) error {
	return nil
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
