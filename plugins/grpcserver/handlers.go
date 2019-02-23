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

package grpcserver

import (
	"context"
	"fmt"
	"os"

	pb "github.com/anthonydevelops/osseus/plugins/grpcserver/model"
	"github.com/golang/protobuf/ptypes/empty"
)

// CreatePlugin inserts a new plugin into the kv
func (s *GrpcService) CreatePlugin(ctx context.Context, req *pb.CreatePluginRequest) (*pb.PluginData, error) {
	err := DB.Put(req.Plugin.Id, req)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	return &pb.PluginData{Id: req.Plugin.Id, CdnLink: req.Plugin.CdnLink, Status: req.Plugin.Status}, nil
}

// GetPlugin retrieves a given plugin
func (s *GrpcService) GetPlugin(ctx context.Context, req *pb.GetPluginRequest) (*pb.PluginData, error) {
	val := &pb.PluginData{}
	found, rev, err := DB.GetValue(req.Id, val)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Printf("Plugin was found: %t, with revision %v", found, rev)

	return val, nil
}

// DeletePlugin deletes a currently stored plugin
func (s *GrpcService) DeletePlugin(ctx context.Context, req *pb.DeletePluginRequest) (*empty.Empty, error) {
	existed, err := DB.Delete(req.Id)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Printf("Plugin was deleted: %t", existed)

	return nil, nil
}
