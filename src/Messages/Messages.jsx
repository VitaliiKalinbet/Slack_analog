import React, { Component } from 'react';
import MessageHeader from '../MessageHeader/MessageHeader';
import firebase from '../firebase';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import MessageForm from '../MessageForm/MessageForm.jsx';
import SingleMessage from '../SingleMessage/SingleMessage';

class Messages extends Component {

    state= {
        messages: [],
        messagesRef: firebase.database().ref('messages'),
        loading: true,
    }

    componentDidMount () {
        setTimeout(() => {
            const {currentChannel, currentUser} = this.props;
            if (currentChannel && currentUser) {
                this.addListeners(currentChannel.id)
            }
        }, 1000)
    }

    addListeners = channelId => {
        let loadedMessages = [];
        this.state.messagesRef
        .child(channelId)
        .on('child_added', snap => {
            loadedMessages.push(snap.val())
            // console.log(loadedMessages);
            this.setState({
                messages: loadedMessages,
                loading: false,
            })
        })
    }

    render() {
        const {messages} = this.state;
        return (
            <React.Fragment>
                <MessageHeader/>
                <Segment>
                    <Comment.Group
                    className='messages'>
                        {messages.length > 0 && messages.map(message => <SingleMessage
                                key={message.time}
                                message={message}
                                user={message.user}
                                />
                        )}
                    </Comment.Group>
                </Segment>
                <MessageForm messagesRef={this.state.messagesRef}/>
            </React.Fragment>
        );
    }
}

function mapStateToProps (state) {
    return {
        currentChannel: state.channel,
        currentUser: state.user.currentUser,
    }
}

export default connect(mapStateToProps)(Messages);