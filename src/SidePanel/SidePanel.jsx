import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from '../UserPanel/UserPanel';
import Channels from '../Channels/Channels';
import DirectMessage from '../DirectMessage/DirectMessage';

class SidePanel extends Component {
    render() {
        return (
            <Menu
            size='large'
            inverted
            fixed='left'
            vertical
            style={{background: '#4c3c4c', fontSize:'1.2rem'}}>
                <UserPanel/>
                <Channels/>
                <DirectMessage/>
            </Menu>
        );
    }
}

export default SidePanel;