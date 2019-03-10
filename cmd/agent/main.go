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
	"github.com/ligato/cn-infra/agent"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/logging/logmanager"
	log "github.com/ligato/cn-infra/logging/logrus"
	"os"
	"osseus/plugins/restapi"
)

// OsseusAgent is a struct holding internal data for the Ligato-Gen Agent
type OsseusAgent struct {
	LogManager *logmanager.Plugin
	Rest       *restapi.Plugin
}

// New creates new OsseusAgent instance.
func New() *OsseusAgent {

	return &OsseusAgent{
		LogManager:       &logmanager.DefaultPlugin,
		Rest:       &restapi.DefaultPlugin,
	}

}

// Init initializes main plugin.
func (ss *OsseusAgent) Init() error {
	return nil
}

// AfterInit normally executes resync, nothing for now.
func (ss *OsseusAgent) AfterInit() error {

	return nil
}

// Close could close used resources.
func (ss *OsseusAgent) Close() error {
	return nil
}

// String returns name of the plugin.
func (ss *OsseusAgent) String() string {
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
