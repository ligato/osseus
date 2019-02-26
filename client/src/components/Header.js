import React from 'react';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import "../styles/Header.css";

let arrows = "<--->";

const Header = () => {
    return (
        <div>
            <Segment>
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column>
                            <Link className="header-link" to="/">Plugin App</Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link className="header-link" to="/GeneratorApp">Generator App</Link>
                        </Grid.Column>
                    </Grid>
                    <Divider vertical>{arrows}</Divider>
                </Segment>
        </div>
    );
};
export default Header;