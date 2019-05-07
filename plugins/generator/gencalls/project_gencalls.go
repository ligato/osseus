package gencalls

import (
	"archive/tar"
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
	"text/template"

	"github.com/ligato/osseus/plugins/generator/model"
)

type fileEntry struct {
	Name string
	Body string
}

type pluginAttr struct {
	ImportPath    string
	Declaration    string
	Initialization string
}

// GenAddProj creates a new generated template under the /template prefix
func (d *ProjectHandler) GenAddProj(key string, val *model.Project) error {
	encodedFile := d.createTar(val)

	// Create template
	data := &model.Template{
		Name:    val.GetProjectName(),
		TarFile: encodedFile,
	}

	// Put new value in etcd
	err := d.broker.Put(val.GetProjectName(), data)
	if err != nil {
		d.log.Errorf("Could not create template")
		return err
	}
	d.log.Infof("Return data, Key: %q Value: %+v", val.GetProjectName(), data)

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

func (d *ProjectHandler) fillTemplate(val *model.Project) string {
	// Write variables into template
	var genCode bytes.Buffer
	check := func(err error) {
		if err != nil {
			log.Fatal(err)
		}
	}

	//get array of plugin structs
	PluginsList := d.createPluginStructs(val.Plugin)

	t, er := template.New("main.go_template").Parse(goCodeTemplate)
	check(er)

	// Populate code template with variables
	data := struct {
		ProjectName      string
		PluginAttributes []pluginAttr
		// special case plugins
		IdxMapExists     bool
	}{
		ProjectName:      val.GetProjectName(),
		PluginAttributes: PluginsList,
		IdxMapExists:     contains(val.Plugin,"idx map"),
	}

	er = t.Execute(&genCode, data)
	check(er)

	d.log.Debug("generated code populated")

	return genCode.String()
}

//create array of plugin structs [only imports for now]
func (d *ProjectHandler) createPluginStructs(plugins []*model.Plugin) []pluginAttr {
	var PluginsList []pluginAttr

	// Cycle through plugins & set import paths
	for _, plugin := range plugins {
		name := strings.ToLower(plugin.PluginName)
		d.log.Debugf("plugin name: %v", name)

		pluginImport := AllPlugins[name][0]
		pluginDecl := AllPlugins[name][1]
		pluginInit := AllPlugins[name][2]
		PluginTemplateVals := pluginAttr{
			ImportPath:    pluginImport,
			Declaration: pluginDecl,
			Initialization:    pluginInit,
		}
		PluginsList = append(PluginsList, PluginTemplateVals)

	}
	return PluginsList
}

func (d *ProjectHandler) generate(val *model.Project) []fileEntry {
	template := d.fillTemplate(val)

	// Create tar structure
	var files = []fileEntry{
		{"/cmd/agent/main.go", template},
	}
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

	//temporary - debug tar file contents
	d.readTarHelper(buf)

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

// temporary helper function to print/view contents of tar file
func (d *ProjectHandler) readTarHelper(buf bytes.Buffer) {
	// Open and iterate through the files in the archive.
	tr := tar.NewReader(&buf)
	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break // End of archive
		}
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("Contents of %s:\n", hdr.Name)
		if _, err := io.Copy(os.Stdout, tr); err != nil {
			log.Fatal(err)
		}
		fmt.Println()
	}
}
