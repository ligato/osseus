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

// Single file within the tar directory
type fileEntry struct {
	Name string
	Body string
}

// Folder and file structure in the template directory
type templateStructureItem struct{
	itemName		string
	absolutePath	string
	fileType		string
	children		[]string
}

// Contents of a single generated file within template structure
type fileContent struct{
	name 	 string
	content  string
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
	key = "zip"
	err := d.broker.Put(key, data)
	if err != nil {
		d.log.Errorf("Could not create template")
		return err
	}

	return nil
}

// GenAddProjStructure adds the file structure of the generated project
func (d *ProjectHandler) GenAddProjStructure(key string, val *model.Project) error{
	templateStructure := d.getTemplateStructure(val)
	fileContents := d.getFileContents(val)

	var templateItems []*model.File
	templateItem := new(model.File)

	var contentList []*model.FileContent
	contentItem := new(model.FileContent)

	// convert Template structure into model structure
	for _, folder := range templateStructure{
		templateItem = &model.File{
			Name: folder.itemName,
			AbsolutePath: folder.absolutePath,
			FileType: folder.fileType,
			Children: folder.children,
		}
		templateItems = append(templateItems, templateItem)
	}

	for _, file := range fileContents{
		contentItem = &model.FileContent{
			FileName: file.name,
			Content:  file.content,
		}
		contentList = append(contentList, contentItem)
	}

	// Create template structure
	data := &model.TemplateStructure{
		Structure:    templateItems,
		Files:		  contentList,
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
		{"/"+ projectName + "/cmd/agent/doc.go", docTemplate},
		{"/"+ projectName + "/README.md", readmeTemplate},
	}

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
		pluginOptionsEntry := fileEntry{
			"/"+ projectName + "/plugins/" + pluginDirectoryName + "/options.go",
			pluginOptionsContents,
		}
		pluginImplEntry := fileEntry{
			"/"+ projectName + "/plugins/" + pluginDirectoryName + "/plugin_impl_"+ pluginDirectoryName + ".go",
			pluginImplContents,
		}
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

// getTemplateStructure returns name, path, type, and children of each folder and file in generated template
func (d *ProjectHandler) getTemplateStructure(val *model.Project) []templateStructureItem {

	projectName := strings.ToLower(strings.Replace(val.ProjectName, " ", "_", -1))

	// create template structure with agent-level folders and files
	var templateStructure = []templateStructureItem{
		{projectName,
			"/" + projectName,
			"folder",
			[]string{"/" + projectName + "/cmd","/" + projectName + "/plugins","/" + projectName + "/README.md"}},
		{
			"cmd",
			"/" + projectName + "/cmd",
			"folder",
			[]string{"/" + projectName + "/cmd/agent"}},
		{"agent",
			"/" + projectName + "/cmd/agent",
			"folder",
			[]string{"/" + projectName + "/cmd/agent/main.go","/" + projectName + "/cmd/agent/doc.go"}},
		{"main.go",
			"/" + projectName + "/cmd/agent/main.go",
			"file",
			[]string{}},
		{"doc.go",
			"/" + projectName + "/cmd/agent/doc.go",
			"file",
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
			[]string{pluginPath + "/doc.go", pluginPath + "/options.go", pluginPath + "/plugin_impl_"+ pluginName + ".go"},
		}

		docFile := templateStructureItem{
			pluginName + "/doc.go",
			pluginPath + "/doc.go",
			"file",
			[]string{},
		}

		optionsFile := templateStructureItem{
			pluginName + "/options.go",
			pluginPath + "/options.go",
			"file",
			[]string{},
		}

		implFile := templateStructureItem{
			pluginName + "/plugin_impl.go",
			pluginPath + "/plugin_impl_" + pluginName + ".go",
			"file",
			[]string{},
		}

		templateStructure = append(templateStructure, pluginFolder, docFile, optionsFile, implFile)
	}

	readmeFile := templateStructureItem{"readme.md",
			"/" + projectName + "/README.md",
			"file",
			[]string{},
		}
	templateStructure = append(templateStructure, readmeFile)

	return templateStructure
}

// Returns a list of file contents for all generate files
func(d *ProjectHandler) getFileContents(val *model.Project) []fileContent{
	var fileContents []fileContent

	mainTemplate := d.FillMainTemplate(val)
	readmeTemplate := d.FillReadmeTemplate(val.ProjectName)
	docTemplate := d.FillDocTemplate("main")

	// add readme file to batch file contents
	fileContents = append(fileContents,
		fileContent{"readme.go", readmeTemplate})

	// add agent-level go file contents to batch file contents
	fileContents = append(fileContents, fileContent{"main.go", mainTemplate})
	fileContents = append(fileContents,
		fileContent{"doc.go", docTemplate})

	// add custom plugin file contents to batch file contents
	for _, customPlugin := range val.CustomPlugin {
		pluginDirectoryName := strings.ToLower(strings.Replace(customPlugin.PluginName, " ", "_", -1))
		pluginDocContents := d.FillDocTemplate(customPlugin.PackageName)
		pluginOptionsContents := d.FillOptionsTemplate(customPlugin)
		pluginImplContents := d.FillImplTemplate(customPlugin)

		fileContents = append(fileContents,
			fileContent{pluginDirectoryName +"/doc.go",pluginDocContents})
		fileContents = append(fileContents,
			fileContent{pluginDirectoryName +"/options.go", pluginOptionsContents})
		fileContents = append(fileContents,
			fileContent{pluginDirectoryName +"/plugin_impl.go", pluginImplContents})
	}

	return fileContents
}