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

import "github.com/ligato/osseus/plugins/generator/model"

// FillOptionsTemplate inserts plugin info in options.go into template
func (d *ProjectHandler) FillOptionsTemplate(customPlugin *model.CustomPlugin) string {
	// Populate code template with variables
	data := struct {
		PackageName string
		PluginName  string
	}{
		PackageName: customPlugin.PackageName,
		PluginName:  customPlugin.PluginName,
	}

	return d.fillTemplate("options.go_template", pluginOptionsTemplate, data)
}

// FillImplTemplate inserts plugin info in plugin_impl.go into template
func (d *ProjectHandler) FillImplTemplate(customPlugin *model.CustomPlugin) string {
	// Populate code template with variables
	data := struct {
		PackageName string
		PluginName  string
	}{
		PackageName: customPlugin.PackageName,
		PluginName:  customPlugin.PluginName,
	}

	return d.fillTemplate("impl.go_template", pluginImplTemplate, data)
}
