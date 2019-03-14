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

package main

import (
	"os"

	"github.com/ligato/cn-infra/datasync/resync"
	"github.com/ligato/vpp-agent/plugins/orchestrator"

	"github.com/ligato/cn-infra/agent"
	"github.com/ligato/cn-infra/datasync"
	"github.com/ligato/cn-infra/datasync/kvdbsync"
	"github.com/ligato/cn-infra/datasync/kvdbsync/local"
	"github.com/ligato/cn-infra/db/keyval/etcd"
	"github.com/ligato/cn-infra/health/statuscheck"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/logging/logmanager"
	log "github.com/ligato/cn-infra/logging/logrus"
	"github.com/ligato/osseus/plugins/generator"
)

// OsseusAgent is a struct holding internal data for the StrongSwan VPP Agent
type OsseusAgent struct {
	LogManager *logmanager.Plugin
	Generator  *generator.Plugin

	Orchestrator *orchestrator.Plugin
	ETCDDataSync *kvdbsync.Plugin
}

// New creates new OsseusAgent instance.
func New() *OsseusAgent {
	etcdDataSync := kvdbsync.NewPlugin(kvdbsync.UseKV(&etcd.DefaultPlugin))

	writers := datasync.KVProtoWriters{
		etcdDataSync,
	}
	statuscheck.DefaultPlugin.Transport = writers

	// Set watcher for KVScheduler.
	watchers := datasync.KVProtoWatchers{
		local.DefaultRegistry,
		etcdDataSync,
	}
	orchestrator.DefaultPlugin.Watcher = watchers

	return &OsseusAgent{
		LogManager:   &logmanager.DefaultPlugin,
		Orchestrator: &orchestrator.DefaultPlugin,
		ETCDDataSync: etcdDataSync,
		Generator:    &generator.DefaultPlugin,
	}
}

// Init initializes main plugin.
func (oa *OsseusAgent) Init() error {
	return nil
}

// AfterInit normally executes resync, nothing for now.
func (oa *OsseusAgent) AfterInit() error {
	resync.DefaultPlugin.DoResync()
	return nil
}

// Close could close used resources.
func (oa *OsseusAgent) Close() error {
	return nil
}

// String returns name of the plugin.
func (oa *OsseusAgent) String() string {
	return "osseus-agent"
}

func main() {
	osseusAgent := New()

	a := agent.NewAgent(agent.AllPlugins(osseusAgent))

	if err := a.Run(); err != nil {
		log.DefaultLogger().Fatal(err)
	}
}

func init() {
	log.DefaultLogger().SetOutput(os.Stdout)
	log.DefaultLogger().SetLevel(logging.DebugLevel)

}
