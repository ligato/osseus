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

package restapi

import (
	"osseus/plugins/restapi"
	"testing"
)

// tests if server start endpoint returns a message response
func TestGetServer(t *testing.T){
	api := restapi.NewPlugin()
	resp, err := api.GetServerStatus()
	if err != nil || resp == nil{
		t.Errorf("Expected response from server, got error %s instead", err)
	}
	t.Log("Response from server:", resp)
}

// tests if server post plugin endpoint is reached
// todo: pass in ID in http body once endpoint can store data
func TestPostPluginInfo(t *testing.T){
	api := restapi.NewPlugin()
	resp, err := api.SavePlugin()
	if err != nil || resp == nil{
		t.Errorf("Expected response from server, got error %s instead", err)
	}
	t.Log("Response from server:", resp)
}

