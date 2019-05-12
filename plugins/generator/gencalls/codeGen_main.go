package gencalls


import (
	"github.com/ligato/osseus/plugins/generator/model"
	"strings"
)

// fillMain template inserts plugins in main.go into template
func (d *ProjectHandler) FillMainTemplate(val *model.Project) string {

	//get array of plugin structs
	PluginsList := d.createPluginStructs(val.Plugin)

	// Populate code template with variables
	data := struct {
		ProjectName      string
		PluginAttributes []pluginAttr
		// special case plugins (with extra attributes)
		IdxMapExists bool
	}{
		ProjectName:      val.GetProjectName(),
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
