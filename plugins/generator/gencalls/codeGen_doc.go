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

// FillDocTemplate inserts package in doc.go into template
func (d *ProjectHandler) FillDocTemplate(packageString string) string {
	// Populate code template with variables
	data := struct {
		PackageName string
	}{
		PackageName: packageString,
	}

	return d.fillTemplate("doc.go_template", docTemplate, data)
}

// FillReadmeTemplate inserts project info in README into template
func (d *ProjectHandler) FillReadmeTemplate(projectName string) string {
	// Populate code template with variables
	data := struct {
		ProjectName string
	}{
		ProjectName: projectName,
	}

	return d.fillTemplate("readme.md_template", readmeTemplate, data)
}
