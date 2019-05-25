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

type templateStructureItem struct{
	itemName		string
	absolutePath	string
	fileType			string
	etcdKey		string
	children		[]string
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

// GenAddProjStructure adds the file structure of the generated project
func (d *ProjectHandler) GenAddProjStructure(key string, val *model.Project) error{
	templateStructure := d.getTemplateStructure(val)

	var templateItems []*model.File
	templateItem := new(model.File)

	// convert Template structure into model structure
	for _, folder := range templateStructure{
		templateItem = &model.File{
			Name: folder.itemName,
			AbsolutePath: folder.absolutePath,
			FileType: folder.fileType,
			EtcdKey: folder.etcdKey,
			Children: folder.children,
		}
		templateItems = append(templateItems, templateItem)
	}

	// Create template structure
	data := &model.TemplateStructure{
		File:    templateItems,
	}

	// Put new template structure in etcd
	key = "structure/" + val.GetProjectName()
	err := d.broker.Put(key, data)
	if err != nil {
		d.log.Errorf("Could not add template structure")
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
	projectName := strings.ToLower(strings.Replace(val.ProjectName, " ", "_", -1))
	mainTemplate := d.FillMainTemplate(val)
	readmeTemplate := d.FillReadmeTemplate(val.ProjectName)
	docTemplate := d.FillDocTemplate("main")

	// Create tar structure
	var files = []fileEntry{
		{"/"+ projectName + "/cmd/agent/main.go", mainTemplate},
		{"/"+ projectName + "/cmd/agent/README.md", readmeTemplate},
		{"/"+ projectName + "/cmd/agent/doc.go", docTemplate},
	}

	// add agent-level go file contents to database
	d.putGoFile("structure/" + projectName + "/main", mainTemplate)
	d.putGoFile("structure/" + projectName + "/readme", readmeTemplate)
	d.putGoFile("structure/" + projectName + "/doc", docTemplate)

	// todo: possibly add custom plugin-specific readme file/template
	//append a struct of name/body for every custom plugin in project
	for _, customPlugin := range val.CustomPlugin{
		pluginDirectoryName := strings.ToLower(strings.Replace(customPlugin.PluginName, " ", "_", -1))
		pluginDocContents := d.FillDocTemplate(customPlugin.PackageName)
		pluginOptionsContents := d.FillOptionsTemplate(customPlugin)
		pluginImplContents := d.FillImplTemplate(customPlugin)

		pluginDocEntry := fileEntry{
			"/"+ projectName + "/plugins/" + pluginDirectoryName + "/doc.go",
			pluginDocContents,
		}
		d.putGoFile("structure/" + projectName + "/" + customPlugin.PluginName +"/doc", pluginDocContents)

		pluginOptionsEntry := fileEntry{
			"/"+ projectName + "/plugins/" + pluginDirectoryName + "/options.go",
			pluginOptionsContents,
		}
		d.putGoFile("structure/" + projectName + "/" + pluginDirectoryName +"/options", pluginOptionsContents)

		pluginImplEntry := fileEntry{
			"/"+ projectName + "/plugins/" + pluginDirectoryName + "/plugin_impl_"+ pluginDirectoryName + ".go",
			pluginImplContents,
		}
		d.putGoFile("structure/" + projectName + "/" + pluginDirectoryName +"/plugin_impl", pluginImplContents)

		files = append(files, pluginDocEntry, pluginOptionsEntry, pluginImplEntry)
	}

	return files
}

// fillTemplate inserts plugin variables and contents into code template
// Template code can be found in respective X_template.go files
// Agent-level plugin variables can be referenced in main_agent_template_vars.go
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

/*
=========================
Template Folder Structure
=========================
*/

// getTemplateStructure returns path, type, children and etcd-key of each folder and file in generated template
func (d *ProjectHandler) getTemplateStructure(val *model.Project) []templateStructureItem {

	projectName := strings.ToLower(strings.Replace(val.ProjectName, " ", "_", -1))

	// create template structure with agent-level folders and files
	var templateStructure = []templateStructureItem{
		{projectName,
			"/" + projectName,
			"folder",
			"",
			[]string{"/" + projectName + "/cmd","/" + projectName + "/plugins"}},
		{
			"cmd",
			"/" + projectName + "/cmd",
			"folder",
			"",
			[]string{"/" + projectName + "/cmd/agent"}},
		{"agent",
			"/" + projectName + "/cmd/agent",
			"folder",
			"",
			[]string{"/" + projectName + "/cmd/agent/main.go"}},
		{"main.go",
			"/" + projectName + "/cmd/agent/main.go",
			"file",
			"/main",
			[]string{}},
		{"README.md",
			"/" + projectName + "/cmd/agent/README.md",
			"file",
			"/readme",
			[]string{},
		},
		{"doc.go",
			"/" + projectName + "/cmd/agent/doc.go",
			"file",
			"/doc",
			[]string{},
		},
	}

	// append plugin folder item
	var pluginChildren []string
	for _, child := range val.CustomPlugin{
		childPluginName := strings.ToLower(strings.Replace(child.PluginName, " ", "_", -1))
		pluginChildren = append(pluginChildren, "/" + projectName + "/plugins/" + childPluginName)
	}
	pluginFolder := templateStructureItem{
		"plugins",
		"/" + projectName + "/plugins",
		"folder",
		"",
		pluginChildren,
	}
	templateStructure = append(templateStructure, pluginFolder)

	// append plugin folder, doc, impl, options items
	for _,customPlugin := range val.CustomPlugin{
		pluginName := strings.ToLower(strings.Replace(customPlugin.PluginName, " ", "_", -1))
		pluginPath := "/" + projectName + "/plugins/" + pluginName

		pluginFolder := templateStructureItem{
			pluginName,
			pluginPath,
			"folder",
			"",
			[]string{pluginPath + "/doc.go", pluginPath + "/options.go", pluginPath + "/plugin_impl_"+ pluginName + ".go"},
		}

		docFile := templateStructureItem{
			"doc.go",
			pluginPath + "/doc.go",
			"file",
			"/" + pluginName +"/doc",
			[]string{},
		}

		optionsFile := templateStructureItem{
			"options.go",
			pluginPath + "/options.go",
			"file",
			"/" + pluginName +"/options",
			[]string{},
		}

		implFile := templateStructureItem{
			"plugin_impl_" + pluginName + ".go",
			pluginPath + "/plugin_impl_" + pluginName + ".go",
			"file",
			"/" + pluginName +"/plugin_impl",
			[]string{},
		}

		templateStructure = append(templateStructure, pluginFolder, docFile, optionsFile, implFile)
	}

	return templateStructure
}

// putGoFile adds go file contents to etcd at the given key
// key should be "structure/{projectName}/{fileName}
func (d *ProjectHandler) putGoFile(key string, fileContents string) error{

	goFile := &model.FileContent{
		Content: fileContents,
	}
	err := d.broker.Put(key, goFile)
	if err != nil {
		d.log.Errorf("Could not add file contents")
		return err
	}
	return nil
}