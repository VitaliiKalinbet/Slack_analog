import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import { connect } from 'react-redux';
import './App.css';

class App extends Component {
  render() {
    return (
      <Grid columns='equal' className='app' style={{ background: this.props.color.secondaryColor}}>
          <ColorPanel/>
          <SidePanel/>
        <Grid.Column style={{marginLeft: 320}}>
          <Messages/>
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel/>
        </Grid.Column>
      </Grid>
    );
  }
}

function mapStateToProps (state) {
    return {
        color: state.color,
    }
}

export default connect(mapStateToProps)(App);