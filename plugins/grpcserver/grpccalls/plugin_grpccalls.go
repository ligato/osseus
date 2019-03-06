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

package grpccalls

import (
	"github.com/anthonydevelops/osseus/plugins/grpcserver/model"
)

// CreatePlugin creates a new plugin in etcd
func (b *PluginHandler) CreatePlugin(val *model.Plugin) error {
	err := b.broker.Put(val.GetName(), val)
	if err != nil {
		b.log.Errorf("Could not create plugin")
		return err
	}

	return nil
}

// DeletePlugin deletes a plugin in etcd
func (b *PluginHandler) DeletePlugin(key string) error {
	existed, err := b.broker.Delete(key)
	if err != nil {
		b.log.Errorf("Could not delete plugin")
	}
	b.log.Infof("Plugin existed: %v", existed)

	return nil
}
