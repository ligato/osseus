import React from 'react'
import Header from './Header';
import PluginApp from './Plugin/PluginApp';
import GeneratorApp from './Generator/GeneratorApp';
import { BrowserRouter, Route} from 'react-router-dom';

/*
* Structure:  
*                                  App.js                ..................... (parent)
*                             /               \
*                          /                     \
*                       /             |             \
*              PlugApp.js         Header.js          GenApp.js      .......... (children)
*                /   \                                 /   \
*              /       \                             /       \
*            /           \                         /           \
*     PPicker.js       PPalette.js        CStructure.js    CViewer.js    ..... (sub-child)
*         |                 |                                     
*         |                 |
*         |                 |
*     DPlugins.js      DPlugins.js                                          .. (sub-sub-child)
*/        

class App extends React.Component { 
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Header />
                        <Route path="/" exact component={PluginApp} />
                        <Route path="/GeneratorApp" exact component={GeneratorApp} />
                    </div>
                </BrowserRouter>  
            </div>
        );
    }
}
export default App;


