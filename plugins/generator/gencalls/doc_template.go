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

// text/template for doc.go files
const docTemplate = `package {{.PackageName}}`

// text/template for README.md files
const readmeTemplate = `
# {{.ProjectName}}

[![GitHub license](https://img.shields.io/badge/license-Apache%20license%202.0-blue.svg)](https://github.com/ligato/cn-infra/blob/master/LICENSE.md)

Short project description here

## Installation

Installation instructions here

## Documentation

GoDocs can be browsed [online](url-to-godoc-here).

## Contributing

If you are interested in contributing, please see the contribution guidelines.`

