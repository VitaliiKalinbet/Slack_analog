import React, { Component } from 'react';
import MessageHeader from '../MessageHeader/MessageHeader';
import firebase from '../firebase';
import { Segment, Comment } from 'semantic-ui-react';
import MessageForm from '../MessageForm/MessageForm.jsx';

class Messages extends Component {

    state= {
        messagesRef: firebase.database().ref('messages'),
    }

    render() {
        return (
            <React.Fragment>
                <MessageHeader/>
                <Segment>
                    <Comment.Group
                    className='messages'
                    >
                        {/* messages */}
                    </Comment.Group>
                </Segment>
                <MessageForm messagesRef={this.state.messagesRef}/>
            </React.Fragment>
        );
    }
}

export default Messages;