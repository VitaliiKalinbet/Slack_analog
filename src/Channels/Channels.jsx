import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../redux/actions/setCurrentChannelAction';
// import { stat } from 'fs';

class Channels extends Component {

    state= {
        activeChannel: '',
        channels : [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true,
    }

    componentDidMount () {
        this.addListener();
    }

    componentWillUnmount () {
        this.removeListener();
    }

    removeListener = () => {
        this.state.channelsRef.off();
    }

    addListener = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val())
            // console.log(loadedChannels);
            this.setState({
                channels: loadedChannels,
            }, () => this.loadFirstChannel()
            )
        })
    }

    showActiveChannel = (channel) => {
        this.setState({
            activeChannel: channel.id,
        })
    }

    loadFirstChannel = () => {
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(this.state.channels[0]);
            this.showActiveChannel(this.state.channels[0]);
        }
        this.setState({
            firstLoad: false,
        })
    }

    openModal = () => {
        this.setState({
            modal: true,
        })
    }

    closeModal = () => {
        this.setState({
            modal: false,    
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isFormValid(this.state)) {
            // console.log('channel added');
            this.addChannel();
        }
    } 

    addChannel = () => {
        const {channelsRef, channelName, channelDetails} = this.state;
        const key = channelsRef.push().key;
        const newchannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: this.props.user.displayName,
                avatar: this.props.user.photoURL,
            }
        }
        // console.log(newchannel);
        channelsRef
        .child(key)
        .update(newchannel)
        .then(() => {
            this.setState({
                channelName: '',
                channelDetails: '',
            })
            this.closeModal();
            console.log('channel added');
        })
        .catch(err => console.log(err))
    }

    onClickChannelFunc = (channel) => {
        this.props.setCurrentChannel(channel);
        this.showActiveChannel(channel);
    }

    render() {
        const {channels, modal} = this.state;
        return (
            <React.Fragment>
            <Menu.Menu style={{paddingBottom:'2rem'}}>
            <Menu.Item>
                <span>
                    <Icon name='exchange'/> CHANNELS
                </span> ({channels.length})<Icon name='add' onClick={this.openModal}/>
            </Menu.Item>
            {channels.length > 0 && channels.map(channel => {
                return <Menu.Item
                    key={channel.id}
                    name={channel.name}
                    style={{opacity:0.7}}
                    onClick={() => this.onClickChannelFunc(channel)}
                    active = {channel.id === this.state.activeChannel}
                    >
                # {channel.name}    
                </Menu.Item>
            })}
            </Menu.Menu>
            <Modal open={modal} onClose={this.closeModal} style={{background:'#fff'}}>
            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <Input 
                        fluid 
                        label='Channel  Name'
                        name='channelName'
                        onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input 
                        fluid 
                        label='Channel Details'
                        name='channelDetails'
                        onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={this.closeModal}>
                    <Icon name='remove'/> Cancel
                </Button>
                <Button color='green' inverted onClick={this.handleSubmit}>
                    <Icon name='checkmark'/> Add
                </Button>
            </Modal.Actions>
            </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.currentUser,
})

const mapDispatchToProps = dispatch => {
    return {
        setCurrentChannel: function (channel) {
            dispatch(setCurrentChannel(channel))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Channels);