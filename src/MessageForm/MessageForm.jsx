import React, { Component } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from '../firebase';
import {connect} from 'react-redux';
import uuidv4 from 'uuid/v4';
import FileModal from '../FileModal/FileModal';

class MessageForm extends Component {

    state = {
        message: '',
        loading: false,
        errors: [],
        modal: false,
        uploadTask: null,
        storageRef: firebase.storage().ref(),
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
            message: e.target.value,
        })
    }

    createMessage = (url = null) => {
        const message = {
            // content: this.state.message,
            time: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.props.currentUser.uid,
                name: this.props.currentUser.displayName,
                avatar: this.props.currentUser.photoURL,
            }
        }

        if (url !== null) {
            message['image'] = url;
        } else {
            message['content'] = this.state.message;
        }

        return message;
    }

    sendMessage = () => {
        const {messagesRef, currentChannel} = this.props;
        const {message} = this.state;
        if (message) {
            this.setState({
                loading: true,
            })
            messagesRef
            .child(currentChannel.id)
            .push()
            .set(this.createMessage())
            .then(() => {
                this.setState({
                    loading: false, 
                    message: '',
                })
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    errors: this.state.errors.concat(err)
                })
            })
        }
    }

    sendFileMessage = (url, ref, path) => {
        ref.child(path)
            .push()
            .set(this.createMessage(url))
            .catch(err => {
                console.log(err);
            })
    }

    uploadFile = (file, metadata) => {
        // console.log(file, metadata);
        const pathToUpload = this.props.currentChannel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/image${uuidv4()}.jpg`;
        this.setState({
                uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
            },
            () => {
                this.state.uploadTask.on(
                    'state_changed',
                    () => {
                        this.state.uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then(download => {
                                this.sendFileMessage(download, ref, pathToUpload);
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                )
            }
        )
    }
    
    render() {
        return (
            <Segment className='message_form'>
            <Input
                onChange={this.handleChange}
                value={this.state.message}
                fluid
                name='message'
                style={{
                    marginBottom: '0.7rem'
                }}
                label={<Button icon = 'add' />}
                labelPosition='left'
                placeholder='Write your message'/>
            <Button.Group icon widths='2'>
                <Button onClick={this.sendMessage} color='orange' content='Add Reply' labelPosition='left' icon='edit'/>
                <Button color='teal' content='Upload media' labelPosition='right' icon='cloud upload' onClick={this.openModal}/>
                <FileModal uploadFile={this.uploadFile} modal={this.state.modal} closeModal={this.closeModal}/>
            </Button.Group>   
        </Segment>
    );
    }
}

function mapStateToProps (state) {
    return {
        currentUser: state.user.currentUser,
        currentChannel: state.channel,
    }
}

export default connect(mapStateToProps)(MessageForm);