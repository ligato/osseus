package gencalls

import (
	"archive/tar"
	"bytes"
	"encoding/base64"
	"log"
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

/*
=========================
Code Generation
=========================
*/

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

// generate creates the tar structure with file directory and contents
func (d *ProjectHandler) generate(val *model.Project) []fileEntry {
	mainTemplate := d.FillMainTemplate(val)
	docTemplate := d.FillDocTemplate("main")

	// Create tar structure
	var files = []fileEntry{
		{"/cmd/agent/main.go", mainTemplate},
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

// todo: make sure comment name matches refactored files
// fillTemplate inserts plugin variables and contents into code template
// Template code can be found in respective X_template.go files
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


