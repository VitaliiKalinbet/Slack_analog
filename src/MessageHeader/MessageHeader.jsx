import React, { Component } from 'react';
import {Segment, Header, Icon, Input} from 'semantic-ui-react';
import {connect} from 'react-redux';

class MessageHeader extends Component {

    render() {
        return (
            <Segment clearing>
                <Header
                    fluid='true'
                    as='h2'
                    floated='left'
                    style={{
                        marginBottom: 0
                    }}>
                    <span>
                        {this.props.channel === null ? 'Channel' : this.props.channel.name}
                        <Icon name='star outline' color='black'/>
                    </span>
                    <Header.Subheader>
                        {this.props.countUser}
                    </Header.Subheader>
                </Header>
                {/* ChannelSearch Input */}
                <Header floated='right'>
                    <Input value={this.props.valueInput} onChange={this.props.handleMessages} size='mini' icon='search' name='searchTerm' placeholder='Search'/>
                </Header>
            </Segment>
        );
    }
}

function mapStateToProps (state) {
    return {
        channel: state.channel,
    }
}

export default connect(mapStateToProps)(MessageHeader);