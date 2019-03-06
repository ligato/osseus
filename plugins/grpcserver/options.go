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

package grpcserver

import (
	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/datasync/kvdbsync"
	"github.com/ligato/cn-infra/datasync/kvdbsync/local"
	"github.com/ligato/cn-infra/db/keyval/etcd"
	"github.com/ligato/cn-infra/rpc/grpc"
	"github.com/ligato/vpp-agent/plugins/kvscheduler"
)

// DefaultPlugin is a default instance of Plugin.
var DefaultPlugin = *NewPlugin()

// NewPlugin creates a new Plugin with the provided Options.
func NewPlugin(opts ...Option) *Plugin {
	p := &Plugin{}

	p.SetName("grpcserver")
	p.Grpc = &grpc.DefaultPlugin
	p.Scheduler = &kvscheduler.DefaultPlugin
	p.KVStore = &etcd.DefaultPlugin
	p.ETCDDataSync = kvdbsync.NewPlugin(kvdbsync.UseKV(&etcd.DefaultPlugin))

	watchers := datasync.KVProtoWatchers{
		local.DefaultRegistry,
		p.ETCDDataSync,
	}

	p.Watcher = watchers

	for _, o := range opts {
		o(p)
	}

	p.Setup()

	return p
}

// Option is a function that can be used in NewPlugin to customize Plugin.
type Option func(*Plugin)

// UseDeps returns Option that can inject custom dependencies.
func UseDeps(cb func(*Deps)) Option {
	return func(p *Plugin) {
		cb(&p.Deps)
	}
}
