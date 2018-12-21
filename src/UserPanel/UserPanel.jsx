import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import firebase from '../firebase';

class UserPanel extends Component {

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>User</strong></span>,
            disabled: true,
        },
        {
            key: 'avatar',
            text: <span><Icon name='picture'/>Change Avatar</span>
        },
        {
            key: 'out',
            text: <span onClick={this.signOut}><Icon name='sign-out'/>Sign Out</span>
        }
    ];

    signOut = () => {
        firebase
        .auth()
        .signOut()
        .then(() => {
            console.log('signed out');
        })
    }

    render() {
        return (
            <Grid style={{
                backround: '4c3c4c',
            }}>
                <Grid.Column>
                    <Grid.Row
                        style={{
                            padding: '1.2rem',
                            margin: '0'
                        }}>
                            <Header inverted floated='left' as='h2'>
                                <Icon name='cloud'/>
                                <Header.Content>Slack clone</Header.Content>
                            </Header>
                        </Grid.Row>
                        {/* user dropdown */}
                        <Header style={{padding: '0.25rem'}} as='h4' inverted>
                            <Dropdown trigger={
                                <span style={{marginLeft: '1rem'}}><Image src={this.props.user.photoURL} spaced='right' avatar/>{this.props.user.displayName}</span>
                            } options={this.dropdownOptions()}/>
                        </Header>
                </Grid.Column>
            </Grid>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.user.currentUser,
    }
}

// displayName  photoURL

export default connect(mapStateToProps)(UserPanel);