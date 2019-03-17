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

package model

import (
	"github.com/ligato/vpp-agent/pkg/models"
)

// ModuleName is the module name used for all the models of this plugin.
const ModuleName = "generator"

var (
	// ModelProject defines the registered model
	ModelProject = models.Register(&Project{}, models.Spec{
		Module:  ModuleName,
		Version: "v1",
		Type:    "project",
	}, models.WithNameTemplate("{{.Name}}"))
	// ModelTemplate defines the registered model
	ModelTemplate = models.Register(&Template{}, models.Spec{
		Module:  ModuleName,
		Version: "v1",
		Type:    "template",
	}, models.WithNameTemplate("{{.Name}}"))
)

// ProjectKey returns the key used in NB DB to store the configuration
// of a skeleton value with the given logical name.
func ProjectKey(name string) string {
	return models.Key(&Project{
		Name: name,
	})
}

// TemplateKey returns the key used in NB DB to store the configuration
// of a skeleton value with the given logical name.
func TemplateKey(name string) string {
	return models.Key(&Template{
		Name: name,
	})
}
