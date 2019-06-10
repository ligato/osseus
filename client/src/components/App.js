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

import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom';

import PluginApp from './PluginApp/PluginApp';
import GeneratorApp from './GeneratorApp/GeneratorApp';

/*
* This defines the three routes from the web app, the plugin app and
* the generator app.
*/
class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route path="/" exact component={PluginApp} />
            <Route path="/GeneratorApp" exact component={GeneratorApp} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
