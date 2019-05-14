package gencalls

import "github.com/ligato/osseus/plugins/generator/model"

// fillOptions template inserts plugin info in options.go into template
func (d *ProjectHandler) FillOptionsTemplate(customPlugin *model.CustomPlugin) string {
	// Populate code template with variables
	data := struct {
		PackageName 	string
		PluginName      string
	}{
		PackageName:     customPlugin.PackageName,
		PluginName:      customPlugin.CustomPluginName,
	}

	return d.fillTemplate("options.go_template", pluginOptionsTemplate, data)
}

// fillImpl template inserts plugin info in plugin_impl.go into template
func (d *ProjectHandler) FillImplTemplate(customPlugin *model.CustomPlugin) string {
	// Populate code template with variables
	data := struct {
		PackageName 	string
		PluginName      string
	}{
		PackageName:     customPlugin.PackageName,
		PluginName:      customPlugin.CustomPluginName,
	}

	return d.fillTemplate("impl.go_template", pluginImplTemplate, data)
}
