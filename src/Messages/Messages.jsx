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
        filterMessages: [],
        inputSerch: '',
        messagesRef: firebase.database().ref('messages'),
        loading: true,
        countUser: '',
    }

    componentDidMount () {
        setTimeout(() => {
            const {currentChannel, currentUser} = this.props;
            if (currentChannel && currentUser) {
                this.addListeners(currentChannel.id)
            }
        }, 1000)
    }

    componentDidUpdate (prevProps) {
        if (prevProps.currentChannel && this.props.currentChannel) {
            // console.log('first');
            if (prevProps.currentChannel.name !== this.props.currentChannel.name) {
                // console.log('second');
                this.addListeners(this.props.currentChannel.id);
            }
        }
    }

    // addListeners = channelId => {
    //     let loadedMessages = [];

    //     this.state.messagesRef
    //     .child(channelId)
    //     .on('child_added', snap => {         
    //         this.state.
    //         loadedMessages.push(snap.val())
    //         this.setState({
    //             messages: loadedMessages,
    //             loading: false,
    //         });
    //         this.countUnicUsers(loadedMessages)
    //     })

    // }


    addListeners = channelId => {
        let loadedMessages = [];
       
        this.state.messagesRef.child(channelId).on('value', snap => {
          if (snap.exists()) {
            this.state.messagesRef.child(channelId).on('child_added', snap => {
                loadedMessages.push(snap.val())
                this.setState({
                  messages: loadedMessages,
                  loading: false,
                }, () => this.countUnicUsers(this.state.messages))
              })
          } else {
            this.setState({
                  messages: [],
                  loading: false,
                }, () => this.countUnicUsers(this.state.messages))
          } 
        })
    }


    countUnicUsers = messages => {
        const iniqueUsers = messages.reduce((acc, el) => {
            if (!acc.includes(el.user.name)) {
                acc.push(el.user.name)
            }
            return acc
        }, [])
        this.setState({
            countUser: `${iniqueUsers.length} users`
        })
    }

    serchMessages = () => {
        if (this.state.inputSerch) {
            const arr = this.state.messages.filter(item => item.content ? item.content.toLowerCase().includes(this.state.inputSerch.toLowerCase()) : null);
            this.setState({
                filterMessages: [...arr],
            })
            console.log('this.state.inputSerch work');
        } else if (this.state.inputSerch === '') {
            this.setState({
                filterMessages: [],
            })
            console.log('this.state.inputSerch === "" work');
        }
    }

    handleMessages = async (e) => {
        await this.setState({
            inputSerch: e.target.value,
        })
        this.serchMessages()
     }

    render() {
        const {messages, filterMessages} = this.state;
        return (
            <React.Fragment>
                <MessageHeader handleMessages={this.handleMessages} valueInput={this.state.inputSerch} countUser={this.state.countUser}/>
                <Segment>
                    <Comment.Group
                    className='messages'>
                        {filterMessages.length > 0 
                        ? 
                            filterMessages.map(message => <SingleMessage
                            key={message.time}
                            message={message}
                            user={message.user}
                            />)
                        :
                            messages.map(message => <SingleMessage
                            key={message.time}
                            message={message}
                            user={message.user}
                            />)
                    }
                    
                        {/* {messages.length > 0 && messages.map(message => <SingleMessage
                                key={message.time}
                                message={message}
                                user={message.user}
                                />
                        )} */}
                    </Comment.Group>
                </Segment>
                <MessageForm messagesRef={this.state.messagesRef} />
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