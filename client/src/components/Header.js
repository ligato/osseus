import React from 'react';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import store from '../redux/store/index';
import { addPluginArray } from "../redux/actions/index";
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
  tellMeToSave () {
    store.dispatch( addPluginArray(store.getState().savedPlugins));
    swal({
      title: "Saved!",
      text: 'Your Project is saved under "Project ' + store.getState().projects.length + '"!',
      icon: "success",
      button: "OK",
    });
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
              <Link className="generator-link" to="/GeneratorApp">Generate</Link>
              <button className="save-button" onClick={this.tellMeToSave} >Save Project</button>
            </Grid.Column>
          </Grid>
          <Divider vertical>{arrows}</Divider>
        </Segment>
      </div>
    );
  }
}
export default Header;