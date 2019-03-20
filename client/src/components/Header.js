import React from 'react';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import store from '../redux/store/index';
import { addPluginArray, setCurrArray } from "../redux/actions/index";
import swal from 'sweetalert';
import "../styles_CSS/Header.css";

const arrows = "<--->";

/*
* This header contains two Links in the form of links that each represent a route 
* their own webpage. Project selection is the default (/) route.
* Because of how this header is rendered in App.js, this compenent is rendered on all
* pages for site navigation.
*/

class Header extends React.Component {
  save() {
    var plugins = JSON.parse(JSON.stringify(store.getState().savedPlugins));
    store.dispatch(addPluginArray([plugins]));

    const project = store.getState().projects[0]
    console.log(project)
    // Save current project
    fetch('http://0.0.0.0:8000/demo/saveMultiple', {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    })
      // Log response
      .then(res => console.log("Success: ", JSON.stringify(res)))
      .catch(err => console.log("Error: ", err))

    // Popup to signal saved project
    swal({
      title: "Saved!",
      text: 'Your Project is saved under "Project ' + store.getState().projects.length + '"!',
      icon: "success",
      button: "OK",
    });
  }

  generate() {
    // Get current plugins in palette
    const plugins = JSON.parse(JSON.stringify(store.getState().currProject));
    store.dispatch(setCurrArray([plugins]));

    const project = store.getState().currProject[0];
    console.log(project)
    // Send plugins to agent
    fetch('http://0.0.0.0:8000/demo/generate', {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    })
      // Log response
      .then(res => console.log("Success: ", JSON.stringify(res)))
      .catch(err => console.log("Error: ", err))
  }

  render() {
    return (
      <div>
        <Segment>
          <Grid columns={2} relaxed='very'>
            <Grid.Column className="header-column">
              <Link className="project-selection-link" to="/">Project</Link>
              <Link className="plugin-nav" to="/PluginApp">Plugin App</Link>
            </Grid.Column>
            <Grid.Column className="header-column">
              <Link className="generator-nav" to="/GeneratorApp">Generator App</Link>
              <Link className="generator-link" onClick={this.generate} to="/GeneratorApp">Generate</Link>
              <button className="save-button" onClick={this.save} >Save Project</button>
            </Grid.Column>
          </Grid>
          <Divider vertical>{arrows}</Divider>
        </Segment>
      </div>
    );
  }
}
export default Header;