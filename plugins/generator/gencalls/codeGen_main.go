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

package gencalls

import (
	"github.com/ligato/osseus/plugins/generator/model"
	"strings"
)

// Syntax of how a plugin is imported, declared and initialized
type pluginAttr struct {
	ImportPath     string
	Declaration    string
	Initialization string
}

// fillMain template inserts plugins in main.go into template
func (d *ProjectHandler) FillMainTemplate(val *model.Project) string {

	//get array of plugin structs
	PluginsList := d.createPluginStructs(val.Plugin)

	// Populate code template with variables
	data := struct {
		ProjectName      string
		AgentName        string
		PluginAttributes []pluginAttr
		// special case plugins (with extra attributes)
		IdxMapExists bool
	}{
		ProjectName:      val.GetProjectName(),
		AgentName:        val.GetAgentName(),
		PluginAttributes: PluginsList,
		IdxMapExists:     contains(val.Plugin, "idx map"),
	}

	return d.fillTemplate("main.go_template", mainCodeTemplate, data)
}

//create array of plugin structs
func (d *ProjectHandler) createPluginStructs(plugins []*model.Plugin) []pluginAttr {
	var PluginsList []pluginAttr

	// Cycle through plugins & set import paths
	for _, plugin := range plugins {
		name := strings.ToLower(plugin.PluginName)

		pluginImport := AllPlugins[name][0]
		pluginDecl := AllPlugins[name][1]
		pluginInit := AllPlugins[name][2]
		PluginTemplateVals := pluginAttr{
			ImportPath:     pluginImport,
			Declaration:    pluginDecl,
			Initialization: pluginInit,
		}
		PluginsList = append(PluginsList, PluginTemplateVals)

	}
	return PluginsList
}

// check if plugins slice contains plugin
func contains(plugins []*model.Plugin, pluginName string) bool {
	for _, pl := range plugins {
		if strings.ToLower(pl.PluginName) == pluginName {
			return true
		}
	}
	return false
}
