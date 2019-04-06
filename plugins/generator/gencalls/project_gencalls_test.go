//  Copyright (c) 2018 Cisco and/or its affiliates.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at:
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
package gencalls_test

import (
	"testing"

	"github.com/ligato/cn-infra/db/keyval/etcd"
	"github.com/ligato/cn-infra/logging/logrus"

	"github.com/ligato/cn-infra/db/keyval"
	"github.com/ligato/osseus/plugins/generator/gencalls"
	"github.com/ligato/osseus/plugins/generator/model"
)

var projectEntries = []*model.Project{
	&model.Project{
		ProjectName: "test1_project",
		Plugin: []*model.Plugin{
			&model.Plugin{
				PluginName: "test1_plugin",
				Id:         1,
			},
		},
	},
	&model.Project{
		ProjectName: "test2_project",
		Plugin: []*model.Plugin{
			&model.Plugin{
				PluginName: "test2_plugin",
				Id:         3,
			},
		},
	},
}

type Test struct {
	KVStore keyval.KvProtoPlugin
}

func TestAddProj(t *testing.T) {
	addHandler := genTestSetup(t)
	err := addHandler.GenAddProj("/test/", projectEntries[0])
	if err != nil {
		t.Errorf("Error in adding a new project")
	}
}

func genTestSetup(t *testing.T) gencalls.ProjectAPI {
	kv := new(Test)
	kv.KVStore = &etcd.DefaultPlugin
	log := logrus.NewLogger("test-log")
	handler := gencalls.NewProjectHandler(log, kv.KVStore)
	return handler
}
