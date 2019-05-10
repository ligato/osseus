package gencalls

import (
	"archive/tar"
	"bytes"
	"encoding/base64"
	"log"
	"strings"
	"text/template"

	"github.com/ligato/osseus/plugins/generator/model"
)

type fileEntry struct {
	Name string
	Body string
}

type pluginAttr struct {
	ImportPath     string
	Declaration    string
	Initialization string
}

// GenAddProj creates a new generated template under the /template prefix
func (d *ProjectHandler) GenAddProj(key string, val *model.Project) error {

	genCodeFile := d.fillTemplate(val)
	// Create template
	data := &model.Template{
		Name:    val.GetProjectName(),
		TarFile: genCodeFile,
	}

	// Put new value in etcd
	err := d.broker.Put(val.GetProjectName(), data)
	if err != nil {
		d.log.Errorf("Could not create template")
		return err
	}

	return nil
}

// GenDelProj removes a generated project in /template prefix
func (d *ProjectHandler) GenDelProj(val *model.Project) error {
	existed, err := d.broker.Delete(val.GetProjectName())
	if err != nil {
		d.log.Errorf("Could not delete template")
		return err
	}
	d.log.Infof("Delete project successful: ", existed)

	return nil
}

// fillMain template inserts plugins in main.go into template
func (d *ProjectHandler) fillMainTemplate(val *model.Project) string {

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

func (d *ProjectHandler) fillDocTemplate(packageName string) string {
	// Write variables into template
	var genCode bytes.Buffer
	check := func(err error) {
		if err != nil {
			log.Fatal(err)
		}
	}

	t, er := template.New("doc.go_template").Parse(docTemplate)
	check(er)

	// Populate code template with variables
	data := struct {
		packageName      string
	}{
		packageName:      packageName,
	}

	er = t.Execute(&genCode, data)
	check(er)

	return genCode.String()
}

// todo: create a generic fillTemplate that takes name, template and data. Then in each individual fillXTemplate, all they have to define is the data to fill
// todo: decide if I want to separate each template's stuff by go file?

// todo: test to see if codeGen for main still works with this abstraction for interface{}
// todo: make sure comment name matches refactored files
// fillTemplate inserts plugin variables and contents into code template
// Template code can be found in template_gencalls.go
// Plugin variables can be referenced in template_vars_gencalls.go
func (d *ProjectHandler) fillTemplate(name string, templateSkeleton string, data interface{}) string {
	// Write variables into template
	var genCode bytes.Buffer
	check := func(err error) {
		if err != nil {
			log.Fatal(err)
		}
	}

	 t, er := template.New(name).Parse(templateSkeleton)
	check(er)

	er = t.Execute(&genCode, data)
	check(er)

	return genCode.String()
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

// generate creates the tar structure with file directory and contents
func (d *ProjectHandler) generate(val *model.Project) []fileEntry {
	template := d.fillTemplate(val)
	docTemplate := d.fillDocTemplate("main")

	// Create tar structure
	var files = []fileEntry{
		{"/cmd/agent/main.go", template},
		{"/cmd/agent/doc.go", docTemplate},
	}
	// todo: this is wrong -- should be appended for every custom plugin
	//append a struct of name/body for every new plugin in project
	for _, plugin := range val.Plugin {
		pluginDirectoryName := plugin.PluginName
		pluginDocEntry := fileEntry{
			"/plugins/" + pluginDirectoryName + "/doc.go",
			"Doc file for package description",
		}
		pluginOptionsEntry := fileEntry{
			"/plugins/" + pluginDirectoryName + "/options.go",
			"Config file for plugin",
		}
		pluginImplEntry := fileEntry{
			"/plugins/" + pluginDirectoryName + "/plugin_impl_test.go",
			"Plugin file that holds main functions",
		}

		files = append(files, pluginDocEntry, pluginOptionsEntry, pluginImplEntry)
	}

	return files
}

// createTar writes file contents into a tar file with base64 encoding
func (d *ProjectHandler) createTar(val *model.Project) string {
	// Get file generation
	files := d.generate(val)

	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)

	// Loop through files & write to tar
	for _, file := range files {
		hdr := &tar.Header{
			Name: file.Name,
			Mode: 0600,
			Size: int64(len(file.Body)),
		}
		if err := tw.WriteHeader(hdr); err != nil {
			log.Fatal(err)
		}
		if _, err := tw.Write([]byte(file.Body)); err != nil {
			log.Fatal(err)
		}
	}
	// Close once done & turn into []byte
	if err := tw.Close(); err != nil {
		log.Fatal(err)
	}

	// Encode to base64 string
	encodedTar := base64.StdEncoding.EncodeToString([]byte(buf.String()))

	return encodedTar
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
