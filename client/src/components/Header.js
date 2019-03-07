import React from 'react';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import "../styles/Header.css";

let arrows = "<--->";

/*
* This header contains two buttons in the form of links that each represent a route 
* their own webpage. PluginApp page is the default (/) route and GeneratorApp is the 
* route (/GeneratorApp).
* Because of how this header is rendered in App.js, this compenent is rendered on both
* pages.
*/
const Header = () => {
    return (
        <div>
            <Segment>
                <Grid columns={2} relaxed='very'>
                    <Grid.Column className="header-column">
                        <Link className="project-selection-link" to="/">Project</Link>
                        <Link className="plugin-link" to="/PluginApp">Plugin App</Link>
                    </Grid.Column>
                    <Grid.Column className="header-column">
                        <Link className="generator-link" to="/GeneratorApp">Generator App</Link>
                    </Grid.Column>
                </Grid>
                <Divider vertical>{arrows}</Divider>
            </Segment>
        </div>
    );
};
export default Header;