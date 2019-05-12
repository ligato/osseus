package gencalls

// fillOptions template inserts plugin info in options.go into template
func (d *ProjectHandler) FillOptionsTemplate(customPluginName string) string {
	// Populate code template with variables
	data := struct {
		PluginName      string
	}{
		PluginName:      customPluginName,
	}

	return d.fillTemplate("options.go_template", pluginOptionsTemplate, data)
}

// fillImpl template inserts plugin info in plugin_impl.go into template
func (d *ProjectHandler) FillImplTemplate(customPluginName string) string {
	// Populate code template with variables
	data := struct {
		PluginName      string
	}{
		PluginName:      customPluginName,
	}

	return d.fillTemplate("impl.go_template", pluginImplTemplate, data)
}
